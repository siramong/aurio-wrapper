import { PublicKey, Transaction } from "@solana/web3.js";

import { buildAurioTransferTx, getAurioConnection, type AurioAmount } from "./aurio";

const METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

export interface TambuInfo {
  name: string;
  image?: string;
  ownerWallet: PublicKey;
  metadataUri?: string;
}

interface TambuMetadataJson {
  name?: string;
  image?: string;
  properties?: {
    tambu?: boolean;
    payoutWallet?: string;
  };
  payoutWallet?: string;
}

export interface TambuTransferParams {
  sender: string;
  tambuMint: string;
  amount: AurioAmount;
}

function toPublicKey(value: string): PublicKey {
  return new PublicKey(value);
}

function isPublicKeyString(value: string): boolean {
  try {
    toPublicKey(value);
    return true;
  } catch {
    return false;
  }
}

function normalizeUri(uri: string): string {
  if (uri.startsWith("ipfs://")) {
    return `https://ipfs.io/ipfs/${uri.slice("ipfs://".length)}`;
  }

  if (uri.startsWith("ar://")) {
    return `https://arweave.net/${uri.slice("ar://".length)}`;
  }

  return uri;
}

function readBorshString(data: Buffer, offsetRef: { value: number }): string {
  if (offsetRef.value + 4 > data.length) {
    throw new Error("Invalid NFT metadata: truncated string length.");
  }

  const length = data.readUInt32LE(offsetRef.value);
  offsetRef.value += 4;

  if (offsetRef.value + length > data.length) {
    throw new Error("Invalid NFT metadata: truncated string value.");
  }

  const value = data.subarray(offsetRef.value, offsetRef.value + length).toString("utf8");
  offsetRef.value += length;

  return value.replace(/\0+$/g, "").trim();
}

function getMetadataPda(mint: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("metadata"), METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    METADATA_PROGRAM_ID,
  )[0];
}

async function fetchTambuMetadataJson(uri: string): Promise<TambuMetadataJson> {
  const response = await fetch(normalizeUri(uri));

  if (!response.ok) {
    throw new Error(`Unable to fetch Tambu metadata JSON (${response.status}).`);
  }

  return (await response.json()) as TambuMetadataJson;
}

function assertTambuWallet(value: unknown): PublicKey {
  if (typeof value !== "string" || !isPublicKeyString(value)) {
    throw new Error("Tambu metadata does not contain a valid payout wallet.");
  }

  return toPublicKey(value);
}

function parseMetadataAccount(data: Buffer, mint: PublicKey): { name: string; uri: string } {
  if (data.length < 66 || data[0] !== 4) {
    throw new Error("Account does not contain a valid Metaplex metadata record.");
  }

  const parsedMint = new PublicKey(data.subarray(33, 65));

  if (!parsedMint.equals(mint)) {
    throw new Error("Metadata mint mismatch.");
  }

  const offsetRef = { value: 65 };
  const name = readBorshString(data, offsetRef);
  readBorshString(data, offsetRef);
  const uri = readBorshString(data, offsetRef);

  if (!name || !uri) {
    throw new Error("Metadata record is missing required fields.");
  }

  return { name, uri };
}

export async function getTambuFromNFT(mint: string): Promise<TambuInfo> {
  const mintKey = toPublicKey(mint);
  const connection = getAurioConnection();
  const metadataPda = getMetadataPda(mintKey);
  const accountInfo = await connection.getAccountInfo(metadataPda, "confirmed");

  if (!accountInfo?.data) {
    throw new Error("Tambu NFT metadata account not found.");
  }

  const metadataBytes = Buffer.from(accountInfo.data);
  const { name, uri } = parseMetadataAccount(metadataBytes, mintKey);
  const json = await fetchTambuMetadataJson(uri);

  if (json.properties?.tambu !== true) {
    throw new Error("NFT metadata is not marked as a Tambu record.");
  }

  const payoutWallet = assertTambuWallet(json.properties?.payoutWallet ?? json.payoutWallet);

  return {
    name: (json.name ?? name).trim(),
    image: json.image,
    ownerWallet: payoutWallet,
    metadataUri: uri,
  };
}

export async function resolveTambuWallet(mint: string): Promise<PublicKey> {
  return (await getTambuFromNFT(mint)).ownerWallet;
}

export async function isValidTambuNFT(mint: string): Promise<boolean> {
  try {
    await getTambuFromNFT(mint);
    return true;
  } catch {
    return false;
  }
}

export async function payToTambu({ sender, tambuMint, amount }: TambuTransferParams): Promise<Transaction> {
  const wallet = await resolveTambuWallet(tambuMint);

  return buildAurioTransferTx({
    sender,
    recipient: wallet,
    amount,
  });
}
