const { ethers } = require("ethers");

const wallet = ethers.Wallet.createRandom();
console.log("\n=== GUARDE ESTAS INFORMAÇÕES EM UM LUGAR SEGURO ===");
console.log("Endereço:", wallet.address);
console.log("Private Key:", wallet.privateKey);
console.log("=== NUNCA COMPARTILHE SUA PRIVATE KEY ===\n");
