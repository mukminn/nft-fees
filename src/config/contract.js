export const ERC721_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",
  // Mint functions
  "function mint() payable",
  "function NftPriceEth() view returns (uint256)",
  // Common functions for debugging
  "function totalSupply() view returns (uint256)",
  "function maxSupply() view returns (uint256)",
  "function saleActive() view returns (bool)",
  "function publicSaleActive() view returns (bool)",
  "function paused() view returns (bool)"
];

// Hardcoded prices as fallback (in wei/smallest unit)
export const NFT_PRICE_ETH = 20000000000000n; // 0.00002 ETH (20e12 wei)

// Mint limit per wallet
export const MINT_LIMIT_PER_WALLET = 2;

// Base network chainId
export const BASE_CHAIN_ID = 8453n;

// Contract address - NFT Contract
export const CONTRACT_ADDRESS = "0xe2E4CF20d33302CcA9a0483259BF9c08e194455b";

