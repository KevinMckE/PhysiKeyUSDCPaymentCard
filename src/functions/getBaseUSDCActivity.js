export const getBaseUSDCActivity = async () => {
    try {
      const apiEndpoint = `https://api-sepolia.basescan.org/api?module=account&action=txlist&address=0x179F961d5A0cC6FCB32e321d77121D502Fe3abF4&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=QI33XHKXCJCEBMXJHBIESAC4U7HSA6ECCU`;
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
  
      // Extract relevant information from transactions
      const transactions = data.result.map(transaction => {
        const { hash, input, timeStamp, value } = transaction;
        const method = input !== '0x' ? 'IN' : 'OUT'; // Assuming non-empty input represents an incoming transaction
        const age = new Date(parseInt(timeStamp) * 1000); // Convert timestamp to Date object
        const formattedValue = parseFloat(value) / 1e18; // Convert wei to ETH
        return { hash, method, age, value: formattedValue };
      });
  
      console.log(transactions);
      return transactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

