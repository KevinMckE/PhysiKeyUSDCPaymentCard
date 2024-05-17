export const getBaseUSDCActivity = async () => {
  try {
    const walletAddress = '0x179F961d5A0cC6FCB32e321d77121D502Fe3abF4'; // Replace this with your wallet address
    const apiKey = 'QI33XHKXCJCEBMXJHBIESAC4U7HSA6ECCU'; // Replace this with your Etherscan API key
    const contractAddress = '0x036cbd53842c5426634e7929541ec2318f3dcf7e'

    // Construct the API endpoint to fetch token transactions
    const apiEndpoint = `https://api-sepolia.basescan.org/api?module=account&action=tokentx&contractaddress=${contractAddress}&address=${walletAddress}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${apiKey}`;
    
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

    // Extract relevant information from token transactions
    const transactions = data.result.map(transaction => {
      const { hash, timeStamp, value, tokenSymbol } = transaction;
      const method = transaction.to.toLowerCase() === walletAddress.toLowerCase() ? 'IN' : 'OUT';
      const age = new Date(parseInt(timeStamp) * 1000);
      const formattedValue = parseFloat(value) / Math.pow(10, 18); // USDC has 18 decimal places

      return { hash, method, age, value: formattedValue, tokenSymbol };
    });

    console.log(transactions);
    return transactions;
  } catch (error) {
    console.error('Error fetching USDC transactions:', error);
    return [];
  }
}
