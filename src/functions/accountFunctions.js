import CryptoJS from 'crypto-js';
import argon2 from 'react-native-argon2';
import Web3 from 'web3';
const web3 = new Web3('https://sepolia.optimism.io');
let salt = 'BklcooclkncUhnaiianhUcnklcooclkB';

export const accountLogin = async (tag, password) => {
  let tempDataChain = tag + password;
  const argonResult = await argon2(
    tempDataChain,
    salt,
    {
      iterations: 4,
      memory: 32768,
      parallelism: 2,
      mode: 'argon2id'
    }
  );
  let finalDataChain = argonResult.rawHash;
  const innerHash = web3.utils.keccak256(finalDataChain);
  let privateKey = web3.utils.keccak256(innerHash + finalDataChain);

  let oneTimeEncryptionPW = web3.utils.randomHex(32);
  let encryptedPrivateKey = CryptoJS.AES.encrypt(privateKey, oneTimeEncryptionPW).toString();
  let decryptedAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
  let publicKey = decryptedAccount.address;

  console.log('encryptedPrivateKey: ', encryptedPrivateKey);
  console.log('oneTimeEncryptionPW: ', oneTimeEncryptionPW);
  console.log('publicKey: ', publicKey);
  return { publicKey: publicKey, privateKey: privateKey };
};


//// *** WIP
export const signAndSend = async (tag, password, amount, recipient, sender, gas) => {
  try {
    let { publicKey, privateKey } = await accountLogin(tag, password);
    const recipientAddress = web3.utils.toChecksumAddress(web3.utils.pubToAddress(recipient).toString('hex'));
    const gasPrice = await web3.eth.getGasPrice();
    const nonce = await web3.eth.getTransactionCount(publicKey);
    const txObject = {
      from: publicKey,
      to: recipientAddress,
      value: amount,
      gas,
      gasPrice,
      nonce
    };

    const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);
    const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return txReceipt;
  } catch (error) {
    console.error('Cannot complete signAndSend: ', error);
  }
};