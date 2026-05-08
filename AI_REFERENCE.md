# Aurio SDK AI Reference

Use this document when an AI assistant needs a compact, implementation-oriented description of the SDK.

## What This SDK Does

- Builds SPL token transfer transactions for the AURIO token on Solana Devnet.
- Reads SOL and AUR balances for a wallet.
- Supports React / React Native / Expo through optional hooks.
- Resolves Tambu NFT mints into payout wallets using on-chain Metaplex metadata plus the NFT JSON metadata.

## Public Entry Points

- Main SDK: `aurio-sdk`
- Core-only SDK: `aurio-sdk/core`
- Hooks: `aurio-sdk/hooks`

## Required Environment

- `EXPO_PUBLIC_AURIO_MINT` must point to the real AURIO mint address.
- The SDK uses the Devnet RPC endpoint configured in `src/core/constants/web3.ts`.

## Core Behavior

### AURIO transfer flow

- `buildAurioTransferTx({ sender, recipient, amount })` creates an unsigned SPL transfer transaction.
- `recipient` can be a normal wallet address or a Tambu NFT mint address.
- If the recipient looks like a valid Tambu NFT, the SDK resolves the NFT to its payout wallet before building the transfer.
- The function creates associated token accounts when needed.

### Tambu flow

- `getTambuFromNFT(mint)` reads the Metaplex metadata account for the NFT mint.
- It then fetches the JSON metadata from the URI stored on-chain.
- The expected JSON schema is:

```json
{
  "name": "Raíz Café",
  "image": "ipfs://...",
  "properties": {
    "tambu": true,
    "payoutWallet": "SOLANA_PUBLIC_KEY"
  }
}
```

- `resolveTambuWallet(mint)` returns the payout wallet as a `PublicKey`.
- `isValidTambuNFT(mint)` returns `true` only when the NFT has Tambu metadata and a valid payout wallet.
- `payToTambu({ sender, tambuMint, amount })` resolves the NFT and returns the transfer transaction.

## Recommended Usage Patterns

### Pay a normal wallet

```ts
import { buildAurioTransferTx } from "aurio-sdk";

const tx = await buildAurioTransferTx({
  sender: wallet.publicKey.toBase58(),
  recipient: recipientWallet,
  amount: "100",
});
```

### Pay a Tambu NFT

```ts
import { payToTambu } from "aurio-sdk";

const tx = await payToTambu({
  sender: wallet.publicKey.toBase58(),
  tambuMint: "NFT_MINT_ADDRESS",
  amount: 250,
});
```

### Resolve the payout wallet directly

```ts
import { resolveTambuWallet } from "aurio-sdk/core";

const wallet = await resolveTambuWallet("NFT_MINT_ADDRESS");
```

## Important Constraints

- Do not assume a backend exists. This SDK is client-side only.
- Do not change SPL transfer behavior for normal wallets.
- Do not assume every NFT is a Tambu NFT.
- Do not hardcode payout wallets. They must come from metadata.
- Keep the code Expo / React Native compatible.

## When Explaining the SDK To Another AI

- Mention that the library is modular and core logic lives in `src/core`.
- Mention that Tambu resolution is metadata-driven.
- Mention that the payment helper returns a transaction, not a signed transaction.
- Mention that the caller still signs and submits the transaction.
- Mention that the recipient may be either a wallet or a Tambu NFT mint.
