# Aurio SDK - Examples

This directory contains complete, runnable examples demonstrating how to use the Aurio SDK in different environments.

## Examples Overview

### 1. React Native / Expo Components
**Location:** `react-native/`

Pre-built React components for Expo/React Native apps:
- **AurioBalancesExample**: Display SOL and AUR balances
- **AurioMemoExample**: Send memo instructions
- **AurioTransferExample**: Build and send AUR transfers

**Usage:**
```typescript
import { AurioBalancesExample } from 'aurio-sdk-examples/react-native';
import { useAurio } from 'aurio-sdk/hooks';
```

[See React Native examples README](./react-native/README.md)

### 2. Node.js / Server-Side
**Location:** `node-example.mjs`

Pure JavaScript/Node.js example showing SDK usage without React:
- Fetch balances from the blockchain
- Build transactions
- No frontend dependencies

**Usage:**
```bash
# Set environment
export EXPO_PUBLIC_AURIO_MINT=<mint-address>

# Run example
node node-example.mjs
```

**Key Points:**
- No React required
- Works in any Node.js environment
- Async/await API
- Error handling patterns

### 3. Browser / Vanilla JavaScript
**Location:** `browser-example.html`

Interactive HTML example showing SDK usage in browsers:
- Works with any bundler (Vite, Webpack, Esbuild, etc.)
- Vanilla JavaScript (no framework)
- Real-time balance checking
- Transaction building UI

**Usage:**
```bash
# Build the SDK first
npm run build

# Then open browser-example.html in a browser
# Or serve with a local server
npx serve examples/
```

**Key Points:**
- Pure browser-compatible code
- ES modules support
- Responsive UI
- Error handling for edge cases

## Running Examples

### Prerequisites
1. **Install Aurio SDK:**
   ```bash
   # From npm (published package)
   npm install aurio-sdk

   # Or from local source during development
   npm install file:../
   ```

2. **Set Environment Variables:**
   ```bash
   export EXPO_PUBLIC_AURIO_MINT=<your-aurio-mint-address>
   ```

3. **Build SDK (if using local source):**
   ```bash
   npm run build
   ```

### Running Each Example

#### React Native Components
```bash
# In your Expo project
npm install aurio-sdk

# Import in your app
import { AurioBalancesExample } from '../examples/react-native';

// Use in component
<AurioBalancesExample walletAddress={walletAddress} />
```

#### Node.js
```bash
# From project root
export EXPO_PUBLIC_AURIO_MINT=<mint-address>
node examples/node-example.mjs
```

#### Browser
```bash
# Serve the example
npx serve examples/

# Then open http://localhost:3000/browser-example.html
```

## Example Code Patterns

### Pattern 1: Get Balances
```typescript
import { getSolBalance, getAurioBalance } from 'aurio-sdk';

const solBal = await getSolBalance(walletAddress);
const aurBal = await getAurioBalance(walletAddress);

console.log(`SOL: ${solBal}, AUR: ${aurBal}`);
```

### Pattern 2: Build Transfer
```typescript
import { buildAurioTransferTx } from 'aurio-sdk';

const transaction = await buildAurioTransferTx({
  sender: senderAddress,
  recipient: recipientAddress,
  amount: '100.5',
});

// Sign and send with your wallet
const signature = await wallet.signAndSendTransaction(transaction);
```

### Pattern 3: Use React Hook
```typescript
import { useAurio } from 'aurio-sdk/hooks';

function MyComponent({ walletAddress }) {
  const { solBalance, aurBalance, loading, refresh } = useAurio(walletAddress);
  
  return (
    <div>
      <p>SOL: {solBalance}</p>
      <p>AUR: {aurBalance}</p>
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}
```

### Pattern 4: Error Handling
```typescript
try {
  const balance = await getAurioBalance(wallet);
  console.log(balance);
} catch (error) {
  if (error instanceof Error) {
    console.error('Error fetching balance:', error.message);
  }
  // Fallback behavior
}
```

## Common Issues

### "EXPO_PUBLIC_AURIO_MINT is not configured"
Set the environment variable:
```bash
export EXPO_PUBLIC_AURIO_MINT=<your-mint-address>
```

### "Cannot find module 'aurio-sdk'"
Make sure the SDK is installed or built:
```bash
npm run build
# or
npm install aurio-sdk
```

### "React is not defined" in Node.js example
The Node.js example doesn't use React - this error shouldn't occur. If it does, ensure you're running `node-example.mjs` (not a `.ts` file that needs compilation).

## Creating Your Own Examples

To add a new example:

1. Create a new file or directory in `examples/`
2. Import from `aurio-sdk` or `aurio-sdk/hooks`
3. Add documentation in a README
4. Show error handling and edge cases

## Questions?

- Check the main [README.md](../README.md) for API documentation
- See [CONTRIBUTING.md](../CONTRIBUTING.md) for development guidelines
- Open an issue if you find bugs or have questions

---

**Happy coding with Aurio SDK!** 🚀
