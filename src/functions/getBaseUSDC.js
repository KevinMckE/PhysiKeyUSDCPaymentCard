const Web3 = require('web3');
const web3 = new Web3('https://sepolia.base.org');

// Define the USDC contract ABI and address
const usdcABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
]
const usdcAddress = '0x036CbD53842c5426634e7929541eC2318f3dCF7e'; // Example address, replace with actual USDC contract address

const usdcContract = new web3.eth.Contract(usdcABI, usdcAddress);

export const getUSDCBalance = async (walletAddress) => {
  try {
    // Call the balanceOf function of the USDC contract
    const balance = await usdcContract.methods.balanceOf(walletAddress).call();
    return balance;
  } catch (error) {
    console.error('Error getting USDC balance:', error);
    return 0;
  }
}
