import Web3 from 'web3';
const web3 = new Web3('https://sepolia.optimism.io');

export const getGasEstimate = async () => {
  try {
    const gasPrice = await web3.eth.getGasPrice();
    console.log(gasPrice)
    return gasPrice;
  } catch (error) {
    console.error('Error fetching gas estimate: ', error);
    throw error
  }
};