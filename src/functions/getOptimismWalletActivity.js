export const getOptimismWalletActivity = async () => {
  try {
    const apiEndpoint = `https://api-sepolia-optimism.etherscan.io/api?module=account&action=txlist&address=0x179F961d5A0cC6FCB32e321d77121D502Fe3abF4&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=8NTW7B8H8SDEDJCXDTP2RXFNTQY35R3P3T`;
    const response = await fetch(apiEndpoint);

    // Check for errors
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Check the response status from the API
    if (data.status === '0') {
      throw new Error(`API error: ${data.message}`);
    }

    // Assuming the response structure contains a list of transactions
    const transactions = data.result;
    console.log(transactions);
    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}