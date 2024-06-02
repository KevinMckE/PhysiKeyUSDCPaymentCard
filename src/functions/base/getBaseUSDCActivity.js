export const getBaseUSDCActivity = async (walletAddress) => {
  try {
    const apiEndpoint = `https://api-sepolia.basescan.org/api?module=account&action=tokentx&contractaddress=${process.env.BASE_USDC_CONTRACT}&address=${walletAddress}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${process.env.BASE_SCAN_API_KEY}`;
    const response = await fetch(apiEndpoint);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const transactions = data.result.map(transaction => {
      const { timeStamp, value, hash } = transaction;
      const method = transaction.to.toLowerCase() === walletAddress.toLowerCase() ? 'IN' : 'OUT';
      const age = new Date(parseInt(timeStamp) * 1000);
      const formattedValue = parseFloat(value) / Math.pow(10, 18);
      const valueInDollars = formattedValue / 1000000;
      return { age, method, value: valueInDollars, hash };
    });

    return transactions;
  } catch (error) {
    console.error('Error fetching USDC transactions:', error);
    return [];
  }
};

export const groupDataByMonth = (data) => {
  return data.reduce((acc, item) => {
    const date = new Date(item.age);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthYear = `${month}/${year}`;
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(item);
    return acc;
  }, {});
};


export const groupDataByDay = (data) => {
  return data.reduce((acc, item) => {
    const date = new Date(item.age);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayMonthYear = `${day}/${month}/${year}`;
    if (!acc[dayMonthYear]) {
      acc[dayMonthYear] = [];
    }
    acc[dayMonthYear].push(item);
    return acc;
  }, {});
};

export const formatDataByMonth = (data) => {
  const groupedData = groupDataByMonth(data);
  const formattedData = [];
  for (const monthYear in groupedData) {
    formattedData.push({ monthYear, data: groupedData[monthYear] });
  }
  return formattedData.reverse(); // Reverse the order of the array
};

export const formatDataByDay = (data) => {
  const groupedData = groupDataByDay(data);
  const formattedData = [];
  for (const dayMonthYear in groupedData) {
    formattedData.push({ dayMonthYear, data: groupedData[dayMonthYear] });
  }
  return formattedData.reverse(); // Reverse the order of the array
};

/** 
async function transferUSDC(senderPrivateKey, recipientAddress, amount) {
  try {
      const senderAccount = web3.eth.accounts.privateKeyToAccount(senderPrivateKey);
      const senderAddress = senderAccount.address;

      const gasPrice = await web3.eth.getGasPrice();
      const gasEstimate = await usdcContract.methods.transfer(recipientAddress, amount).estimateGas({ from: senderAddress });

      const tx = {
          from: senderAddress,
          to: usdcAddress,
          gas: gasEstimate, // Dynamically set the gas limit
          gasPrice: gasPrice,
          data: usdcContract.methods.transfer(recipientAddress, amount).encodeABI()
      };

      const signedTx = await web3.eth.accounts.signTransaction(tx, senderPrivateKey);
      const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

      console.log('Transaction Hash:', txReceipt.transactionHash);
      return txReceipt;
  } catch (error) {
      console.error('Error transferring USDC:', error);
      throw error;
  }
}

// Usage:
const senderPrivateKey = 'YOUR_SENDER_PRIVATE_KEY'; // Replace with your sender's private key
const recipientAddress = 'RECIPIENT_ADDRESS'; // Replace with the recipient's address
const amount = 'AMOUNT_IN_USDC'; // Specify the amount of USDC to transfer

transferUSDC(senderPrivateKey, recipientAddress, amount)
    .then(txReceipt => {
        console.log('Transaction successful:', txReceipt);
    })
    .catch(error => {
        console.error('Transaction failed:', error);
    });

    */