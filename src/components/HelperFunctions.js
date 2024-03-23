import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';
import { TatumSDK, Network, Optimism, ApiVersion, ResponseDto, NftAddressBalance, NftTokenDetail } from '@tatumio/tatum';
import Config from 'react-native-config';
import CryptoJS from 'crypto-js';
import argon2 from 'react-native-argon2';
import Web3 from 'web3';
const web3 = new Web3('https://api.tatum.io/v3/blockchain/node/optimism-testnet/' + Config.TATUM_API_KEY);

export const readTag = async () => {
  try {
    await NfcManager.requestTechnology(NfcTech.NfcA);
    let tag = await NfcManager.getTag();
    return tag
  } catch (error) {
    console.warn(error);
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

export const writeNdef = async () => {
  try {
    await NfcManager.start();
    await NfcManager.requestTechnology(NfcTech.Ndef);
    const bytes = Ndef.encodeMessage([Ndef.textRecord(dataToWrite)]);
    const tag = await NfcManager.getTag();
    await NfcManager.writeNdefMessage(bytes);
    console.warn('NDEF message written successfully:', dataToWrite);
    await NfcManager.closeTechnology();
    await NfcManager.stop();
  } catch (error) {
    console.error('Error writing NDEF message:', error);
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

export const getAccountNfts = async () => {
  try {
    const tatum = await TatumSDK.init({
      network: Network.OPTIMISM_TESTNET,
      version: ApiVersion.V4,
      apiKey: { v4: '' + Config.TATUM_API_KEY }
    });
    const nftsResponse = await tatum.nft.getBalance({
      addresses: [publicKey],
    });
    if (nftsResponse.data == null) {
    } else {
      return nftsResponse.data;
    }
  } catch (error) {
    console.warn(error);
  }
};



//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
////////// MAIN FUNCTION FOR LOGIN AND ACCOUNT CREATION///////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
export const accountLogin = async (tag, date) => {
  let kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, hasher: CryptoJS.algo.SHA256, iterations: 1024 });
  let salt = 'BklcooclkncUhnaiianhUcnklcooclkB';
  let tempChain = tag;
  tempChain = kdf.compute(tempChain, salt).toString();
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

