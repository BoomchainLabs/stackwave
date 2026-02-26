import { ethers } from "ethers";

/**
 * Token Gating Utility
 * Checks if a user has the minimum required SWAVE balance
 */
export async function checkTokenGatingAccess(walletAddress: string, tokenAddress: string) {
  if (!window.ethereum) return false;
  
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const minBalance = ethers.parseUnits("100", 18);

    const abi = ["function balanceOf(address) view returns (uint256)"];
    const contract = new ethers.Contract(tokenAddress, abi, provider);

    const balance = await contract.balanceOf(walletAddress);

    return balance >= minBalance;
  } catch (error) {
    console.error("Token gating check failed:", error);
    return false;
  }
}
