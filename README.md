This project is built and maintained by [**Anywhere Blockchain Corp**](AnywhereAccess.io) bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

**⚠️ Requires a Tatum API Key, Pimlico RPC API key and Transak API key**  
Change these variables in either:  
- `.env.mainnet`  
- `.env.testnet`
  or
- `.env`  

---

### Step 1: 📦 Clone the repository and install packages
```bash
git clone https://github.com/KevinMckE/RegenCard.git
cd RegenCard
npm install --legacy-peer-deps
```

### Step 2: 🚀 Start your Application

##### For Android

```bash
# for testnet
npm run optimism:sepolia

# for mainnet
npm run optimism:mainnet
```

### For iOS

Use xcode to run and build.

### Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

---

### 🗂 Project Structure
```bash
High Level
├── screens/          # Pages used in the router (main views)
│   └── ...           # Uses components and custom UI
├── components/       # UI elements and modals for handling transactions
│   └── ...           
├── functions/        # Reusable logic functions (no UI)
├── contexts/         # Reusable state that can be accessed app wide
├── styles/           # Common styles that are reused, many styles still live in the components and pages
```
---

### 🔄 Flow Management in Screens
All transaction flows are managed within screens (in screens/).
Each flow step is conditionally rendered inside the same screen.

Example: `SendModal.tsx`
- Case 0 – Enter Recipient
  - Input saved to state.
  - Validated as Bitcoin address.
  - If valid, advance to Case 1.
- Case 1 – Enter Amount
  - Amount saved to state.
  - handleAmountChange() validates input.
  - If valid, runs handleSign().
- handleSign():
  - Uses modal state to call imported helper functions.
  - Calls signTransaction() from functions/.
  - On success, proceeds to Case 2.
- Case 2 – Display Result
  - Shows transaction hash or confirmation.
