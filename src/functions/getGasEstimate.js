import Web3 from 'web3';
const web3 = new Web3('https://sepolia.optimism.io');

export const getGasEstimate = async (sender, receiver, amount) => {
  try {
    const gasEstimate = await web3.eth.estimateGas({
      from: sender,
      to: receiver,
      value: web3.utils.toWei(amount, 'ether')
    });

    const gasPrice = await web3.eth.getGasPrice();
    const gasInEth = web3.utils.fromWei((gasEstimate * gasPrice).toString(), 'ether');
    return gasInEth;
  } catch (error) {
    console.error('Error fetching gas estimate: ', error);
  }
};