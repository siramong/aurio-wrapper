# Aurio SDK

A professional, modular Solana SDK for interacting with the Aurio token. Clean separation between core blockchain logic and optional React hooks.

## Features

- ✅ **Core SDK**: Solana + SPL token logic with zero React dependencies
- ✅ **Optional React Hooks**: Use with React/React Native/Expo or standalone
- ✅ **Type-Safe**: Full TypeScript support with declaration files
- ✅ **Modular Exports**: Import only what you need
- ✅ **Production Ready**: Published as npm package

## Installation

```bash
npm install aurio-sdk
```

## Quick Start

### Core SDK (No React Required)

```typescript
import {
  getAurioBalance,
  getSolBalance,
  buildAurioTransferTx,
  payToTambu,
  getAurioConnection,
} from "aurio-sdk";

// Get balances
const solBalance = await getSolBalance("wallet-address");
const aurBalance = await getAurioBalance("wallet-address");

// Build transfer transaction
const tx = await buildAurioTransferTx({
  sender: "sender-address",
  recipient: "recipient-address",
  amount: "100",
});

const tambuTx = await payToTambu({
  sender: "sender-address",
  tambuMint: "NFT_MINT_ADDRESS",
  amount: 250,
});
```

### With React Hooks (Optional)

```typescript
import { useAurio } from "aurio-sdk/hooks";
import { buildAurioTransferTx } from "aurio-sdk";

function MyComponent({ walletAddress }) {
  const { solBalance, aurBalance, loading, refresh } = useAurio(walletAddress);

  return (
    <div>
      <p>SOL: {solBalance.toFixed(4)}</p>
      <p>AUR: {aurBalance.toFixed(6)}</p>
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}
```

## Environment Setup

Set the Aurio mint address:

```bash
export EXPO_PUBLIC_AURIO_MINT=<your-aurio-mint-address>
```

## API Reference

### Core Functions

#### `getAurioBalance(wallet: string): Promise<number>`
Get the AUR token balance for a wallet.

#### `getSolBalance(wallet: string): Promise<number>`
Get the SOL balance for a wallet.

#### `buildAurioTransferTx(params: BuildAurioTransferTxParams): Promise<Transaction>`
Build a transaction for transferring AUR tokens.

**Parameters:**
- `sender: string` - Sender wallet address
- `recipient: string | PublicKey` - Recipient wallet address or Tambu NFT mint address
- `amount: number | string` - Amount in UI units

#### `payToTambu(params: TambuTransferParams): Promise<Transaction>`
Resolve a Tambu NFT mint to its payout wallet and build the SPL transfer transaction.

**Parameters:**
- `sender: string` - Sender wallet address
- `tambuMint: string` - Tambu NFT mint address
- `amount: number | string` - Amount in UI units

#### `getTambuFromNFT(mint: string): Promise<TambuInfo>`
Read Metaplex metadata and JSON metadata for a Tambu NFT.

#### `resolveTambuWallet(mint: string): Promise<PublicKey>`
Resolve the payout wallet encoded in a Tambu NFT.

#### `isValidTambuNFT(mint: string): Promise<boolean>`
Validate that a mint has Tambu metadata and a valid payout wallet.

#### `getAurioTokenAccount(wallet: string): PublicKey`
Get the associated token account for a wallet.

#### `getAurioConnection(): Connection`
Get the Solana connection instance.

#### `getAurioDecimals(connection: Connection): Promise<number>`
Get AURIO token decimals.

### React Hooks

#### `useAurio(wallet: string | null | undefined): UseAurioResult`

**Returns:**
```typescript
{
  solBalance: number;
  aurBalance: number;
  loading: boolean;
  refresh: () => Promise<void>;
}
```

## Examples

See the `/examples/react-native` directory for complete React Native/Expo examples.

## Directory Structure

```
src/
  core/          ← Solana + SPL logic (no React)
    aurio.ts
    tambu.ts
    constants/
      web3.ts
    index.ts
  hooks/         ← Optional React hooks
    useAurio.ts
    index.ts
  index.ts       ← Main entrypoint

examples/
  react-native/  ← React Native/Expo examples
    *.tsx
```

## Development

Build the SDK:

```bash
npm run build
```

Type-check:

```bash
npm run typecheck
```

## Publishing

```bash
npm publish
```

## License

MIT

## Support

For issues, questions, or contributions, please visit the repository.

## AI Reference

If you are using an AI assistant to work with this SDK, see [AI_REFERENCE.md](./AI_REFERENCE.md) for a compact implementation-oriented overview.
