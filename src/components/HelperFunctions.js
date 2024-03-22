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
    let tagID = tag.id
    return tagID
  } catch (error) {
    console.warn(error);
  } 
};

export const readNdef = async () => {
  try {
    await NfcManager.start();
    NfcManager.setEventListener(NfcTech.Ndef, async (tag) => {
      let ndefData = null;
      try {
        ndefData = await NfcManager.readNdef(tag);
        return ndefData;
      } catch (error) {
        console.warn(error);
      }
    });
    NfcManager.requestTechnology(NfcTech.Ndef);
  } catch (error) {
    console.warn(error);
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

const transferOptimism = async (fromAddress, toAddress, amount, privateKey) => {
  try {
    // Validate the addresses
    if (!web3.utils.isAddress(fromAddress) || !web3.utils.isAddress(toAddress)) {
      throw new Error('Invalid address format.');
    }

    // Validate the amount
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Invalid amount.');
    }

    // Validate the private key
    if (!privateKey || privateKey.length !== 64) {
      throw new Error('Invalid private key.');
    }

    // Create the transaction object
    const txObject = {
      from: fromAddress,
      to: toAddress,
      value: web3.utils.toWei(amount.toString(), 'ether'),
      gas: 21000, // Gas limit
      gasPrice: await web3.eth.getGasPrice(), // Get gas price from the network
    };

    // Sign the transaction
    const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);

    // Send the signed transaction
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log('Transaction hash:', receipt.transactionHash);
    console.log('Transaction successful!');
  } catch (error) {
    console.error('Error transferring Optimism:', error.message);
  }
};

// Example usage:
// Replace the addresses and private key with your own
// transferOptimism('0xSenderAddress', '0xRecipientAddress', 1, 'PrivateKey');





//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
////////// MAIN FUNCTION FOR LOGIN AND ACCOUNT CREATION///////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
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

