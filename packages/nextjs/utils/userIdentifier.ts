import { getNextSigner } from "./automaticSigners";
import { ethers } from 'ethers';

interface UserData {
  userId: string;
  username?: string;
  recoveryMethods: {
    email?: string;
    wallet?: string;
    code?: string;
  };
}

export const generateRecoveryCode = () => {
  return Math.random().toString(36).substring(2, 15);
};

export const createNewUser = async (recoveryOptions: {
  email?: string;
  wallet?: string;
}) => {
  const userId = `player_${Math.random().toString(36).substr(2, 9)}`;
  const recoveryCode = generateRecoveryCode();

  const userData: UserData = {
    userId,
    recoveryMethods: {
      ...recoveryOptions,
      code: recoveryCode
    }
  };

  if (recoveryOptions.email) {
    // Send recovery code to email
    await sendRecoveryEmail(recoveryOptions.email, recoveryCode);
  }

  // Save to localStorage
  localStorage.setItem('game_user_data', JSON.stringify(userData));

  // Save to contract with any connected wallet
  const signer = getNextSigner();
  const contract = YourContract__factory.connect("YOUR_CONTRACT_ADDRESS", signer);
  await contract.registerUser(
    userId,
    recoveryCode,
    recoveryOptions.wallet || ethers.constants.AddressZero,
    recoveryOptions.email || ""
  );

  return userData;
};

export const getUserData = async (): Promise<UserData | null> => {
  // Try localStorage first
  const localData = localStorage.getItem('game_user_data');
  if (localData) {
    return JSON.parse(localData);
  }

  // If not in localStorage, show recovery dialog
  const recoveryCode = prompt("Enter your recovery code to restore your progress:");
  if (!recoveryCode) return null;

  // Verify recovery code on-chain
  const signer = getNextSigner();
  const contract = YourContract__factory.connect("YOUR_CONTRACT_ADDRESS", signer);
  const userId = await contract.getUserIdByRecoveryCode(recoveryCode);

  if (userId) {
    const userData: UserData = { userId, recoveryMethods: { code: recoveryCode } };
    localStorage.setItem('game_user_data', JSON.stringify(userData));
    return userData;
  }

  return null;
}; 