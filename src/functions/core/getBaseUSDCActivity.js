import { BASE_SCAN_ENDPOINT, BASE_SCAN_API_KEY, BASE_USDC_CONTRACT } from '@env'

export const getBaseUSDCActivity = async (walletAddress) => {
  try {
    //const apiEndpoint = `https://${OPTIMISM_SCAN_ENDPOINT}?module=account&action=tokentx&contractaddress=${OPTIMISM_USDC_CONTRACT}&address=${walletAddress}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${OPTIMISM_SCAN_API_KEY}`;
    const apiEndpoint = `https://${BASE_SCAN_ENDPOINT}/api?module=account&action=tokentx&contractaddress=${BASE_USDC_CONTRACT}&address=${walletAddress}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${BASE_SCAN_API_KEY}`;
    const response = await fetch(apiEndpoint);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();

    const now = new Date();
    const past24Hours = now.getTime() - (24 * 60 * 60 * 1000);
    const scaleFactor = 1e18;
    let totalTransferred = 0;
  
    const transactions = data.result.map(transaction => {
      const { timeStamp, value, hash } = transaction;
      const method = transaction.to.toLowerCase() === walletAddress.toLowerCase() ? 'IN' : 'OUT';
      const age = new Date(parseInt(timeStamp) * 1000).toISOString(); // Convert to ISO string
      const formattedValue = parseFloat(value) / scaleFactor;

      const transactionTime = parseInt(timeStamp) * 1000;
      if (transactionTime >= past24Hours) {
        totalTransferred += formattedValue / 1000000;
      }

      return { age, method, value: formattedValue / 1000000, hash };

    });

    const scaledDailyTotal = totalTransferred * scaleFactor;
    const roundedDailyTotal = Math.ceil(scaledDailyTotal);
    const formattedDailyTotal = roundedDailyTotal.toFixed(2);

    const reversedTransactions = transactions.reverse();
    return { transactions: reversedTransactions, totalTransferred: formattedDailyTotal };
  } catch (error) {
    console.error('Error fetching USDC transactions:', error);
    return { transactions: [], totalTransferred: 0 };
  }
};

export const groupDataByMonth = (data) => {
  const groupedByMonth = data.reduce((acc, item) => {
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
  const sortedGroupedByMonth = Object.keys(groupedByMonth).reduce((acc, monthYear) => {
    acc[monthYear] = groupedByMonth[monthYear].sort((a, b) => new Date(b.age) - new Date(a.age));
    return acc;
  }, {});
  return sortedGroupedByMonth;
};

export const groupDataByDay = (data) => {
  const groupedByDay = data.reduce((acc, item) => {
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
  const sortedGroupedByDay = Object.keys(groupedByDay).reduce((acc, day) => {
    acc[day] = groupedByDay[day].sort((a, b) => new Date(b.age) - new Date(a.age));
    return acc;
  }, {});
  return sortedGroupedByDay;
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
