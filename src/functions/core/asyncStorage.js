import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (name, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(name, jsonValue);
  } catch (error) {
    console.log('Could not complete storeData: ', error);
  }
};

export const getData = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);
    return items
      .filter(([key, value]) => key !== "ethereum_account")
      .map(([key, value]) => ({ key, value: JSON.parse(value) }));
  } catch (error) {
    console.log('Could not complete getData: ', error);
    return [];
  }
};

export const removeItemFromAsyncStorage = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log('Item removed from AsyncStorage:', key);
  } catch (error) {
    console.error('Error removing item from AsyncStorage:', error);
  }
};

const ACCOUNT_KEY = 'ethereum_account';
export const getInstantAccount = async () => {
  try {
    const existingAccount = await AsyncStorage.getItem(ACCOUNT_KEY);
  
    if (existingAccount !== null) {
      const account = JSON.parse(existingAccount);
      return account.address;
    }
    console.log('No account found');
    return null;
  } catch (error) {
    console.error('Error retrieving account address:', error);
    throw error;
  }
};