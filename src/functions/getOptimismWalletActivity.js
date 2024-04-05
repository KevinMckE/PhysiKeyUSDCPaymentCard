import Web3 from 'web3';
const web3 = new Web3('https://sepolia.optimism.io');

export const getOptimismWalletActivity = async (address) => {
  try {
    const transactionCount = await web3.eth.getTransactionCount(address);
    const transactions = [];
    for (let i = 0; i < transactionCount; i++) {
      const transaction = await web3.eth.getTransactionFromBlock('latest', i);
      transactions.push(transaction);
    }
    return transactions;
  } catch (error) {
    console.log('Cannot complete getOptimismWalletActivity: ', error);
    return null;
  }
};