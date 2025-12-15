# NFT Fees - ERC-721 Manager

Mini web app untuk mengelola NFT ERC-721 di jaringan Base.

## Fitur

- ✅ View NFT (owner, tokenURI, image preview)
- ✅ Transfer NFT (safeTransferFrom)
- ✅ Approve NFT per tokenId
- ✅ Approve All NFT ke operator
- ✅ Wallet connection (MetaMask)
- ✅ Base network detection

## Setup

1. Install dependencies:
```bash
npm install
```

2. Update contract address di `src/config/contract.js`:
```javascript
export const CONTRACT_ADDRESS = "0xYOUR_CONTRACT_ADDRESS";
```

3. Jalankan development server:
```bash
npm run dev
```

## Build

```bash
npm run build
```

## Tech Stack

- React + Vite
- TailwindCSS
- ethers.js v6
- Base Network (Chain ID: 8453)

