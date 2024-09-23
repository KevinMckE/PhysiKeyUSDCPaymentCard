// libraries
import React, { createContext, useState } from 'react';
// functions
import { storeData } from '../functions/core/asyncStorage';
import { accountLogin } from '../functions/core/accountFunctions';
import { getUSDCBalance } from '../functions/core/getBaseUSDC';
import { getBaseUSDCActivity } from '../functions/core/getBaseUSDCActivity';

export const AccountContext = createContext();

const AccountContextProvider = (props) => {

  const [publicKey, setPublicKey] = useState('');
  const [accountName, setAccountName] = useState('');
  const [balance, setBalance] = useState('');
  const [status, setStatus] = useState('');
  const [dailyAmount, setDailyAmount] = useState();
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCard, setIsCard] = useState(false);

  const setNewAccount = async (tag, password, name, navigation) => {
    try {
      setLoading(true);
      let account = await accountLogin(tag, password);
      let fetchedBalance = await getUSDCBalance(account.address);
      let { transactions: fetchedActivity, totalTransferred } = await getBaseUSDCActivity(account.address);
      if (fetchedBalance === '0.') {
        setBalance('0.0');
      } else {
        setBalance(fetchedBalance);
      }
      setDailyAmount(totalTransferred);
      setActivity(fetchedActivity);
      setPublicKey(account.address);
      setAccountName(name);
      await storeData(name, account.address);
      navigation.navigate('Home');
      setLoading(false);
    } catch (error) {
      console.error('Cannot complete setNewAccount: ', error);
      setStatus(error);
      navigation.navigate('Login');
      setLoading(false);
    }
  };

  const updateAccount = async (address) => {
    setNewBalance(address);
    setNewActivity(address);
  }

  const setNewBalance = async (address) => {
    try {
      let fetchedBalance = await getUSDCBalance(address);
      if (fetchedBalance === '0.') {
        setBalance('0.0');
      } else {
        setBalance(fetchedBalance);
      }
    } catch (error) {
      console.error('Cannot complete fetchBalance: ', error);
      setStatus(error);
    }
  };

  const setNewActivity = async (address) => {
    try {
      let { transactions: fetchedActivity, totalTransferred } = await getBaseUSDCActivity(address);
      setActivity(fetchedActivity);
      setDailyAmount(totalTransferred);
    } catch (error) {
      console.error('Cannot complete fetchActivity: ', error);
      setStatus(error);
    }
  };


  const setNewCard = async (isCard) => {
    setIsCard(isCard);
  };

  const setNewName = async (name) => {
    setAccountName(name);
  };
  
  const setNewPublicKey = (address) => {
    setPublicKey(address);
  };

  const setStatusMessage = (message) => {
    setStatus(message);
  };

  const setIsLoading = (value) => {
    setLoading(value);
  }

  return (
    <AccountContext.Provider value={{
      publicKey, activity, accountName, balance, status, loading, isCard, dailyAmount, setNewAccount, setStatusMessage, setNewBalance, 
      setIsLoading, setNewName, setNewPublicKey, setNewActivity, setIsCard, updateAccount, setNewCard
    }}>
      {props.children}
    </AccountContext.Provider>
  )
};

export default AccountContextProvider;