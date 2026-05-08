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
- `recipient: string` - Recipient wallet address
- `amount: number | string` - Amount in UI units

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
