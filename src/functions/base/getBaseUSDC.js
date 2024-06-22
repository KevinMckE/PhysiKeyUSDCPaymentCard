import { http, createPublicClient } from "viem";

const abi = [{constant: true, inputs: [{ name: '_owner', type: 'address' }], name: 'balanceOf', outputs: [{ name: 'balance', type: 'uint256' }], type: 'function',},]
const usdcContractAddress = process.env.BASE_USDC_CONTRACT; 

export const getUSDCBalance = async (account) => {
  try {
    const client = createPublicClient({
      transport: http('https://sepolia.base.org'),
    });

    const accountBalance = await client.readContract({
      abi: abi,
      address: '0x036cbd53842c5426634e7929541ec2318f3dcf7e',
      functionName: 'balanceOf',
      args: [account]
    })

    let converted = Number(accountBalance) / 1000000;

    return converted;
  } catch (error) {
    console.error('Error getting USDC balance:', error);
    throw error;
  }
};

