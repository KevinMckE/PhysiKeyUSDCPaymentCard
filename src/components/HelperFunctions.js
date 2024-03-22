import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';
import CryptoJS from 'crypto-js';
import argon2 from 'react-native-argon2';
import Web3 from 'web3';
var web3 = new Web3('https://sepolia.optimism.io');
var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, hasher: CryptoJS.algo.SHA256, iterations: 1024 });

export const readSerial = async () => {
  try {
    await NfcManager.requestTechnology(NfcTech.NfcA);
    const tag = await NfcManager.getTag();
    return tag.id
  } catch (error) {
    console.log(error);
  } finally {
    NfcManager.cancelTechnologyRequest();
  }
};

export const closeSerial = async () => {
  try {
    await NfcManager.cancelTechnologyRequest();
  } catch (error) {
    console.log(error);
  }
};

export const accountLogin = async (tag, date) => {
  let salt = 'BklcooclkncUhnaiianhUcnklcooclkB';
  let tempChain = tag;
  tempChain += date;
  let finalChain = kdf.compute(tempChain, salt).toString();
  let tempDataChain = finalChain;
  const argonResult = await argon2(
    tempDataChain,
    salt,
    {
      iterations: 5,
      memory: 65536,
      parallelism: 2,
      mode: 'argon2id'
    }
  );
  //console.warn(argonResult);
  let finalDataChain = argonResult.rawHash;
  const innerHash = web3.utils.keccak256(finalDataChain);
  let privateKey = web3.utils.keccak256(innerHash + finalDataChain);

  let oneTimeEncryptionPW = web3.utils.randomHex(32);
  let encryptedPrivateKey = CryptoJS.AES.encrypt(privateKey, oneTimeEncryptionPW).toString();
  let decryptedAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
  let publicKey = decryptedAccount.address;

  console.warn(encryptedPrivateKey);
  console.warn(oneTimeEncryptionPW);
  console.warn(publicKey);
  return publicKey;
};

const writeNdef = async () => {
  let scheme = '';
  const nfcInput = Ndef.uriRecord(`${scheme}${tagValue}`);
  const bytes = Ndef.encodeMessage([nfcInput]);
  //console.warn(bytes);

  try {
    await NfcManager.requestTechnology(NfcTech.Ndef);
    await NfcManager.ndefHandler.writeNdefMessage(bytes);
  } catch (ex) {
    // bypass
  } finally {
    NfcManager.cancelTechnologyRequest();
  }
};

export const getOptimismBalance = async (address) => {
  try {
    const balance = await web3.eth.getBalance(address);
    const balanceInEth = web3.utils.fromWei(balance, 'ether')
    return balanceInEth;
  } catch (error) {
    console.warn(error);
    return null;
  }
};

export const getOptimismWalletActivity = async (address) => {
  try {
    const transactionCount = await web3.eth.getTransactionCount(address);
    const transactions = [];
    for (let i = 0; i < transactionCount; i++) {
      const transaction = await web3.eth.getTransactionFromBlock('latest', i);
      transactions.push(transaction);
    }
    return transactions;
  } catch (error) {
    console.warn(error);
    return null;
  }
};

