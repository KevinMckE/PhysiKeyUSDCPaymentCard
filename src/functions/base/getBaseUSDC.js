import { http, createPublicClient } from 'viem';
import Config from 'react-native-config';

const abi = [{
  constant: true,
  inputs: [{ name: '_owner', type: 'address' }],
  name: 'balanceOf',
  outputs: [{ name: 'balance', type: 'uint256' }],
  type: 'function',
}];

const usdcContractAddress = '0x036cbd53842c5426634e7929541ec2318f3dcf7e';

export const getUSDCBalance = async (address) => {
  try {
    const client = createPublicClient({
      transport: http(Config.RPC_URL),
    });

    const accountBalance = await client.readContract({
      abi: abi,
      address: usdcContractAddress,
      functionName: 'balanceOf',
      args: [address],
    });

    let converted = Number(accountBalance) / 1000000;

    // Format the balance to two decimal points
    let formattedBalance = converted.toFixed(2);

    return formattedBalance;
  } catch (error) {
    console.error('Error getting USDC balance:', error);
    throw error;
  }
};