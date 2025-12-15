export const ERC721_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function getApproved(uint256 tokenId) view returns (address)",
  "function isApprovedForAll(address owner, address operator) view returns (bool)",
  "function approve(address to, uint256 tokenId)",
  "function setApprovalForAll(address operator, bool approved)",
  "function transferFrom(address from, address to, uint256 tokenId)",
  "function safeTransferFrom(address from, address to, uint256 tokenId)"
];

// Base network chainId
export const BASE_CHAIN_ID = 8453n;

// Contract address - UPDATE THIS with your ERC-721 contract address on Base
export const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

