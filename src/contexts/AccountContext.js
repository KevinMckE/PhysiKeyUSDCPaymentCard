// libraries
import React, { createContext, useState } from 'react';
// functions
import { storeData } from '../functions/core/asyncStorage';
import { accountLogin } from '../functions/core/accountFunctions';
import { getUSDCBalance } from '../functions/base/getBaseUSDC';
import { getBaseUSDCActivity } from '../functions/base/getBaseUSDCActivity';

export const AccountContext = createContext();

const AccountContextProvider = (props) => {

  const [publicKey, setPublicKey] = useState('');
  const [accountName, setAccountName] = useState('');
  const [balance, setBalance] = useState('');
  const [status, setStatus] = useState('');
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(false);

  const setNewAccount = async (tag, password, name, navigation) => {
    try {
      let account = await accountLogin(tag, password);
      let fetchedBalance = await getUSDCBalance(account.address);
      if (fetchedBalance === '0.') {
        setBalance('0.0');
      } else {
        setBalance(fetchedBalance);
      }
      const fetchedActivity = await getBaseUSDCActivity(account.address);
      setActivity(fetchedActivity);
      setPublicKey(account.address);
      setAccountName(name);
      await storeData(name, account.address);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Cannot complete setNewAccount: ', error);
      setStatus(error);
    }
  };

  const setNewBalance = async () => {
    try {
      let fetchedBalance = await getUSDCBalance(publicKey);
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

  const setNewActivity = async () => {
    try {
      const fetchedActivity = await getBaseUSDCActivity(publicKey);
      setActivity(fetchedActivity);
    } catch (error) {
      console.error('Cannot complete fetchAcitivy: ', error);
      setStatus(error);
    }
  };

  const setStatusMessage = (message) => {
    setStatus(message);
  };

  const setIsLoading = (value) => {
    setLoading(value);
  }

  return (
    <AccountContext.Provider value={{
      publicKey, activity, accountName, balance, status, loading, setNewAccount, setStatusMessage, setNewBalance, 
      setIsLoading, setNewActivity
    }}>
      {props.children}
    </AccountContext.Provider>
  )
};

export default AccountContextProvider;