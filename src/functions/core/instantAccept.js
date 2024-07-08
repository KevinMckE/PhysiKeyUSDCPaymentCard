import Web3 from 'web3';
import AsyncStorage from '@react-native-async-storage/async-storage';
const web3 = new Web3('https://sepolia.base.org');

const ACCOUNT_KEY = 'ethereum_account';

const createAndSaveAccount = async () => {
  try {
    const existingAccount = await AsyncStorage.getItem(ACCOUNT_KEY);
    
    if (existingAccount !== null) {
      const account = JSON.parse(existingAccount);
      const publicKey = web3.eth.accounts.privateKeyToAccount(account.privateKey).publicKey;
      console.log('Account already exists:', account);
      console.log('Public Key:', publicKey);
      return { ...account, publicKey };
    }

    const newAccount = web3.eth.accounts.create();
    const publicKey = web3.eth.accounts.privateKeyToAccount(newAccount.privateKey).publicKey;

    await AsyncStorage.setItem(ACCOUNT_KEY, JSON.stringify(newAccount));
    console.log('New account created and saved:', newAccount);
    console.log('Public Key:', publicKey);
    return { ...newAccount, publicKey };

  } catch (error) {
    console.error('Error creating or saving account:', error);
    throw error;
  }
};

export default createAndSaveAccount;