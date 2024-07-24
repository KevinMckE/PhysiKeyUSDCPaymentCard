import React, { createContext, useState } from 'react';
import { storeData } from '../functions/core/asyncStorage';
import { accountLogin } from '../functions/core/accountFunctions';
import { getUSDCBalance } from '../functions/base/getBaseUSDC';

export const AccountContext = createContext();

const AccountContextProvider = (props) => {
  const [publicKey, setPublicKey] = useState('');
  const [accountName, setAccountName] = useState('');
  const [balance, setBalance] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const setNewAccount = async (tag, password, name) => {
    try {
      setLoading(true);
      let account = await accountLogin(tag, password);
      let fetchedBalance = await getUSDCBalance(publicKey);
      if (fetchedBalance === '0.') {
        setBalance('0.0');
      } else {
        setBalance(fetchedBalance);
      }
      await storeData(name, account.address);
      setPublicKey(account.address);
      setAccountName(name);
      navigation.navigate('Home');
      setLoading(false);
    } catch (error) {
      console.error('Cannot complete setNewAccount: ', error);
      setStatus(error);
    }
  };

  const setStatusMessage = (message) => {
    setStatus(message);
  };

  const setNewBalance = async () => {
    try {
      setLoading(true);
      let fetchedBalance = await getUSDCBalance(publicKey);
      if (fetchedBalance === '0.') {
        setBalance('0.0');
      } else {
        setBalance(fetchedBalance);
      }
      setLoading(false);
    } catch (error) {
      console.error('Cannot complete fetchBalance: ', error);
      setStatus(error);
    }
  };


  return (
    <AccountContext.Provider value={{
      publicKey, accountName, balance, status, loading, setNewAccount, setStatusMessage, setNewBalance
    }}>
      {props.children}
    </AccountContext.Provider>
  )
};

export default AccountContextProvider;