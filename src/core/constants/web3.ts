import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

const globalProcess = globalThis as typeof globalThis & {
  process?: {
    env?: Record<string, string | undefined>;
  };
};

export const DEVNET_RPC = clusterApiUrl("devnet");

const ENV_MINT = globalProcess.process?.env?.EXPO_PUBLIC_AURIO_MINT;

export const AURIO_MINT: PublicKey | null = ENV_MINT ? new PublicKey(ENV_MINT) : null;

export const AURIO_CONNECTION = new Connection(DEVNET_RPC, "confirmed");

export function isAurioMintConfigured(): boolean {
  return AURIO_MINT !== null;
}

export function getAurioMint(): PublicKey {
  if (!AURIO_MINT) {
    throw new Error(
      "AURIO_MINT is not configured. Set EXPO_PUBLIC_AURIO_MINT in your environment."
    );
  }

  return AURIO_MINT;
}
