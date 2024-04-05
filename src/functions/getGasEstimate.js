import Web3 from 'web3';
const web3 = new Web3('https://sepolia.optimism.io');

export const getGasEstimate = async (sender, receiver, amount) => {
    try {
        const gasEstimate = await web3.eth.estimateGas({
            from: sender,
            to: receiver,
            value: web3.utils.toWei(amount, 'ether') 
        });

        return gasEstimate;
    } catch (error) {
        console.error('Error fetching gas estimate: ', error);
    }
};