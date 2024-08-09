import { http, createPublicClient } from 'viem';
import { OPTIMISM_USDC_CONTRACT, RPC_URL } from '@env';

const abi = [{
  constant: true,
  inputs: [{ name: '_owner', type: 'address' }],
  name: 'balanceOf',
  outputs: [{ name: 'balance', type: 'uint256' }],
  type: 'function',
}];

export const getUSDCBalance = async (address) => {
  try {
    const client = createPublicClient({
      transport: http(RPC_URL),
    });
    const accountBalance = await client.readContract({
      abi: abi,
      address: OPTIMISM_USDC_CONTRACT,
      functionName: 'balanceOf',
      args: [address],
    });
    let converted = Number(accountBalance) / 1000000;
    let formattedBalance = converted.toFixed(2);
    return formattedBalance;
  } catch (error) {
    console.error('Error getting USDC balance:', error);
    throw error;
  }
};