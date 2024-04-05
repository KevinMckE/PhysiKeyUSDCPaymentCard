import Web3 from 'web3';
const web3 = new Web3('https://sepolia.optimism.io');

export const getOptimismBalance = async (address) => {
  try {
    const balance = await web3.eth.getBalance(address);
    const balanceInEth = web3.utils.fromWei(balance, 'ether');
    return balanceInEth;
  } catch (error) {
    console.log('Cannot complete getOptimismBalance: ', error);
    return null;
  }
};