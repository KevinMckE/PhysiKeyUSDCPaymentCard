export const getOptimismWalletActivity = async () => {
  try {
    const apiEndpoint = `https://api-sepolia-optimism.etherscan.io/api?module=account&action=txlist&address=0x179F961d5A0cC6FCB32e321d77121D502Fe3abF4&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${apiKey}`;
    const response = await fetch(apiEndpoint);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    const transactions = data.result.map(transaction => {
      const { hash, input, timeStamp, value } = transaction;
      const method = input !== '0x' ? 'IN' : 'OUT'; 
      const age = new Date(parseInt(timeStamp) * 1000); 
      const formattedValue = parseFloat(value) / 1e18; 
      return { hash, method, age, value: formattedValue };
    });
    console.log(transactions);
    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};