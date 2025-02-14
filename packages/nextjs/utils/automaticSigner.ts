import { ethers } from 'ethers';

// Create a wallet with a hardcoded private key (only for devnet!)
const DEMO_PRIVATE_KEY = "YOUR_PRIVATE_KEY_HERE"; // Fund this account with test DMON
export const automaticSigner = new ethers.Wallet(
  DEMO_PRIVATE_KEY,
  new ethers.providers.JsonRpcProvider("https://rpc-devnet.monadinfra.com/rpc/3fe540e310bbb6ef0b9f16cd23073b0a")
); 