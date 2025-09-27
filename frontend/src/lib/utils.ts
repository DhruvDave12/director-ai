import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { arbitrumSepolia, baseSepolia, polygonAmoy } from "viem/chains";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getExplorerUrl(chainId: number, txHash: string) {
  switch (chainId) {
    case baseSepolia.id:
      return `https://sepolia.basescan.org/tx/${txHash}`;
    case polygonAmoy.id:
      return `https://amoy.polygonscan.com/tx/${txHash}`;
      case arbitrumSepolia.id:
        return `https://sepolia.arbiscan.io/tx/${txHash}`;
    default:
      return `https://etherscan.io/tx/${txHash}`;
  }
}