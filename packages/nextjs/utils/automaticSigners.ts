import { ethers } from 'ethers';

const SIGNER_PRIVATE_KEYS = [
  "PRIVATE_KEY_1",
  "PRIVATE_KEY_2",
  "PRIVATE_KEY_3",
  // Add more as needed
];

const provider = new ethers.providers.JsonRpcProvider("https://rpc-devnet.monadinfra.com/rpc/3fe540e310bbb6ef0b9f16cd23073b0a");

// Create a pool of signers
const signerPool = SIGNER_PRIVATE_KEYS.map(key => new ethers.Wallet(key, provider));

let currentSignerIndex = 0;

export const getNextSigner = () => {
  // Round-robin through signers
  const signer = signerPool[currentSignerIndex];
  currentSignerIndex = (currentSignerIndex + 1) % signerPool.length;
  return signer;
}; 