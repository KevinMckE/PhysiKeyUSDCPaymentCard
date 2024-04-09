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
  return { publicKey: publicKey, encryptedPrivateKey: encryptedPrivateKey, oneTimeEncryptionPW: oneTimeEncryptionPW };
};

export const signAndSend = async (tag, password, amount, recipient, gas, sender) => {
  let { publicKey, encryptedPrivateKey, oneTimeEncryptionPW } = await accountLogin(tag, password);
  web3.eth.getTransactionCount(publicKey, (err, txCount) => {
    txObject = {
      "nonce": web3.utils.toHex(txCount),
      "from": web3.utils.toHex(publicKey),
      "to": web3.utils.toHex(recipient),
      "value": web3.utils.toHex(web3.utils.toWei(amount, 'ether')),
      "gasLimit": web3.utils.toHex(21000),
      "gasPrice": web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
    }
    try {
      web3.eth.accounts.signTransaction(txObject, CryptoJS.AES.decrypt(encryptedPrivateKey, oneTimeEncryptionPW).toString(CryptoJS.enc.Utf8), (err, signedTransaction) => {
        web3.eth.sendSignedTransaction(signedTransaction.rawTransaction, (err, txHash) => {
          console.warn('txHash: ', txHash);
        })
      });
    } catch (error) {
      console.log(error);
    }
  })
};


