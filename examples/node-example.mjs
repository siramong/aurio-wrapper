/**
 * Example: Using Aurio SDK in Node.js (without React)
 * 
 * This demonstrates that the SDK core works standalone,
 * without any React dependencies.
 * 
 * Usage:
 *   1. Set EXPO_PUBLIC_AURIO_MINT environment variable
 *   2. Run: node node-example.mjs
 */

import {
  getAurioBalance,
  getSolBalance,
  getAurioConnection,
  buildAurioTransferTx,
} from "aurio-sdk";

async function main() {
  // Example wallet address (use a real one)
  const walletAddress = "YourWalletAddressHere";

  try {
    console.log("🔍 Fetching balances...");

    // Get SOL balance
    const solBalance = await getSolBalance(walletAddress);
    console.log(`💰 SOL Balance: ${solBalance.toFixed(4)} SOL`);

    // Get AURIO balance
    const aurBalance = await getAurioBalance(walletAddress);
    console.log(`🪙 AUR Balance: ${aurBalance.toFixed(6)} AUR`);

    // Get connection info
    const connection = getAurioConnection();
    console.log(`📡 RPC Endpoint: ${connection.rpcEndpoint}`);

    // Example: Build a transfer transaction (unsigned)
    console.log("\n📝 Building transfer transaction...");
    const tx = await buildAurioTransferTx({
      sender: walletAddress,
      recipient: "RecipientAddressHere",
      amount: "1.5",
    });

    console.log(`✅ Transaction built with ${tx.instructions.length} instructions`);
    console.log(`📦 Fee payer: ${tx.feePayer?.toBase58()}`);

  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error);
  }
}

main();
