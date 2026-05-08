# Aurio SDK - React Native Examples

This directory contains React Native / Expo example components demonstrating how to use the Aurio SDK.

## Components

- **AurioBalancesExample**: Display SOL and AUR balances with a refresh button
- **AurioMemoExample**: Send a memo instruction to the Solana blockchain
- **AurioTransferExample**: Build and send AUR transfers with dynamic recipient and amount

## Usage

These examples import from `aurio-sdk` package and use the optional React hooks:

```tsx
import { useAurio } from "aurio-sdk/hooks";
import { buildAurioTransferTx } from "aurio-sdk";
```

## Integration

To integrate these components into your React Native/Expo app:

1. Install the Aurio SDK: `npm install aurio-sdk`
2. Import the component you need
3. Pass required props (wallet address, connected wallet interface)
4. Ensure `EXPO_PUBLIC_AURIO_MINT` environment variable is set

## Requirements

- React Native >= 0.74.0
- React >= 18.0.0
- aurio-sdk package installed
