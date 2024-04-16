import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('@storage_Key', jsonValue)
  } catch (error) {
    console.log('Could not complete storeData: ', error)

  }
};

export const getData = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);
    return items.map(([key, value]) => ({ key, value: JSON.parse(value) }));
  } catch (error) {
    console.log('Could not complete getData: ', error);
    return [];
  }
};