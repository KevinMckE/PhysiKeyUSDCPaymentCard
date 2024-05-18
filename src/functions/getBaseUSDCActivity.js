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

    console.log(transactions);
    return transactions;
  } catch (error) {
    console.error('Error fetching USDC transactions:', error);
    return [];
  }
};

