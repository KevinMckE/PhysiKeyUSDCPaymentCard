import { BASE_SCAN_API_KEY } from '@env';

export const getBaseUSDCActivity = async (walletAddress) => {
  try {
    const apiEndpoint = `https://api-sepolia.basescan.org/api?module=account&action=tokentx&contractaddress=0x036cbd53842c5426634e7929541ec2318f3dcf7e&address=${walletAddress}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${BASE_SCAN_API_KEY}`;
    const response = await fetch(apiEndpoint);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const transactions = data.result.map(transaction => {
      const { timeStamp, value, hash } = transaction;
      const method = transaction.to.toLowerCase() === walletAddress.toLowerCase() ? 'IN' : 'OUT';
      const age = new Date(parseInt(timeStamp) * 1000).toISOString(); // Convert to ISO string
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
  return formattedData; 
};

export const formatDataByDay = (data) => {
  const groupedData = groupDataByDay(data);
  const formattedData = [];
  for (const dayMonthYear in groupedData) {
    formattedData.push({ dayMonthYear, data: groupedData[dayMonthYear] });
  }
  return formattedData; 
};
