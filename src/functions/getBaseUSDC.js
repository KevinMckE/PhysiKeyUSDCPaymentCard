const Web3 = require('web3');
const web3 = new Web3('https://sepolia.base.org');
const usdcABI = [{constant: true, inputs: [{ name: '_owner', type: 'address' }], name: 'balanceOf', outputs: [{ name: 'balance', type: 'uint256' }], type: 'function',},]
const usdcAddress = process.env.BASE_USDC_CONTRACT; 

const usdcContract = new web3.eth.Contract(usdcABI, usdcAddress);

export const getUSDCBalance = async (walletAddress) => {
  try {
    const balance = await usdcContract.methods.balanceOf(walletAddress).call();
    const balanceInUSDC = parseFloat(balance) / Math.pow(10, 6);
    return balanceInUSDC;
  } catch (error) {
    console.error('Error getting USDC balance:', error);
    return 0;
  }
};

