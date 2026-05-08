import {
  Connection,
  PublicKey,
  Transaction,
  LAMPORTS_PER_SOL,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  Token,
} from "@solana/spl-token";

import {
  AURIO_CONNECTION,
  getAurioMint,
  isAurioMintConfigured,
} from "./constants/web3";
import { isValidTambuNFT, resolveTambuWallet } from "./tambu";

export type AurioAmount = number | string;

export interface BuildAurioTransferTxParams {
  sender: string;
  recipient: string | PublicKey;
  amount: AurioAmount;
}

let cachedAurioDecimals: number | null = null;
let cachedAurioDecimalsPromise: Promise<number> | null = null;

function assertAurioMintConfigured(): void {
  if (!isAurioMintConfigured()) {
    throw new Error(
      "Set EXPO_PUBLIC_AURIO_MINT to the real AURIO mint address before using Aurio SDK."
    );
  }
}

function toPublicKey(value: string): PublicKey {
  return new PublicKey(value);
}

async function resolveRecipientPublicKey(recipient: string | PublicKey): Promise<PublicKey> {
  if (recipient instanceof PublicKey) {
    const recipientMint = recipient.toBase58();

    if (await isValidTambuNFT(recipientMint)) {
      return resolveTambuWallet(recipientMint);
    }

    return recipient;
  }

  if (await isValidTambuNFT(recipient)) {
    return resolveTambuWallet(recipient);
  }

  return toPublicKey(recipient);
}

function normalizeUiAmount(amount: AurioAmount): string {
  const normalized = typeof amount === "number" ? amount.toString() : amount.trim();

  if (!normalized || normalized.startsWith("-")) {
    throw new Error("Amount must be a positive token value.");
  }

  if (/[eE]/.test(normalized)) {
    throw new Error("Use a decimal string instead of scientific notation.");
  }

  return normalized;
}

function uiAmountToBaseUnits(amount: AurioAmount, decimals: number): number {
  const normalized = normalizeUiAmount(amount);
  const [wholePart, fractionPart = ""] = normalized.split(".");
  const sanitizedWhole = wholePart || "0";
  const sanitizedFraction = fractionPart.replace(/[^0-9]/g, "");
  const paddedFraction = sanitizedFraction.padEnd(decimals, "0").slice(0, decimals);
  const baseUnitsBigInt =
    BigInt(sanitizedWhole) * 10n ** BigInt(decimals) + BigInt(paddedFraction || "0");
  const baseUnits = Number(baseUnitsBigInt);

  if (!Number.isSafeInteger(baseUnits)) {
    throw new Error("Amount is too large to encode safely for this SDK version.");
  }

  return baseUnits;
}

export async function getAurioDecimals(connection: Connection): Promise<number> {
  assertAurioMintConfigured();
  const aurioMint = getAurioMint();

  if (cachedAurioDecimals !== null) {
    return cachedAurioDecimals;
  }

  if (!cachedAurioDecimalsPromise) {
    cachedAurioDecimalsPromise = connection
      .getParsedAccountInfo(aurioMint, "confirmed")
      .then((response) => {
        const parsedData = response.value?.data;
        const decimals =
          parsedData && "parsed" in parsedData
            ? Number((parsedData as { parsed?: { info?: { decimals?: number } } }).parsed?.info?.decimals ?? 0)
            : 0;

        cachedAurioDecimals = decimals;
        return decimals;
      })
      .finally(() => {
        cachedAurioDecimalsPromise = null;
      });
  }

  return cachedAurioDecimalsPromise ?? Promise.reject(new Error("Unable to resolve AURIO decimals."));
}

export function getAurioConnection(): Connection {
  return AURIO_CONNECTION;
}

export function getAurioTokenAccount(wallet: string): PublicKey {
  assertAurioMintConfigured();

  const owner = toPublicKey(wallet);
  const mint = getAurioMint();
  const [address] = PublicKey.findProgramAddressSync(
    [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );

  return address;
}

function createAssociatedTokenAccountInstruction(
  associatedAccount: PublicKey,
  owner: PublicKey,
  payer: PublicKey,
  mint: PublicKey
): TransactionInstruction {
  return Token.createAssociatedTokenAccountInstruction(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mint,
    associatedAccount,
    owner,
    payer
  );
}

export async function getSolBalance(wallet: string): Promise<number> {
  try {
    const owner = toPublicKey(wallet);
    const lamports = await AURIO_CONNECTION.getBalance(owner, "confirmed");
    return lamports / LAMPORTS_PER_SOL;
  } catch {
    return 0;
  }
}

export async function getAurioBalance(wallet: string): Promise<number> {
  try {
    assertAurioMintConfigured();
    const aurioMint = getAurioMint();

    const tokenAccount = getAurioTokenAccount(wallet);
    const accountInfo = await AURIO_CONNECTION.getAccountInfo(tokenAccount, "confirmed");

    if (!accountInfo) {
      return 0;
    }

    const balance = await AURIO_CONNECTION.getTokenAccountBalance(tokenAccount, "confirmed");
    return balance.value.uiAmount ?? 0;
  } catch {
    return 0;
  }
}

export async function buildAurioTransferTx({
  sender,
  recipient,
  amount,
}: BuildAurioTransferTxParams): Promise<Transaction> {
  assertAurioMintConfigured();

  const connection = getAurioConnection();
  const aurioMint = getAurioMint();
  const senderPublicKey = toPublicKey(sender);
  const recipientPublicKey = await resolveRecipientPublicKey(recipient);
  const senderTokenAccount = getAurioTokenAccount(sender);
  const recipientTokenAccount = getAurioTokenAccount(recipientPublicKey.toBase58());
  const [senderAccountInfo, recipientAccountInfo, mintDecimals, latestBlockhash] =
    await Promise.all([
      connection.getAccountInfo(senderTokenAccount, "confirmed"),
      connection.getAccountInfo(recipientTokenAccount, "confirmed"),
      getAurioDecimals(connection),
      connection.getLatestBlockhash("confirmed"),
    ]);

  const transaction = new Transaction();
  transaction.feePayer = senderPublicKey;
  transaction.recentBlockhash = latestBlockhash.blockhash;

  if (!senderAccountInfo) {
    transaction.add(
      createAssociatedTokenAccountInstruction(
        senderTokenAccount,
        senderPublicKey,
        senderPublicKey,
        aurioMint
      )
    );
  }

  if (!recipientAccountInfo) {
    transaction.add(
      createAssociatedTokenAccountInstruction(
        recipientTokenAccount,
        recipientPublicKey,
        senderPublicKey,
        aurioMint
      )
    );
  }

  transaction.add(
    Token.createTransferCheckedInstruction(
      TOKEN_PROGRAM_ID,
      senderTokenAccount,
      aurioMint,
      recipientTokenAccount,
      senderPublicKey,
      [],
      uiAmountToBaseUnits(amount, mintDecimals),
      mintDecimals
    )
  );

  return transaction;
}
