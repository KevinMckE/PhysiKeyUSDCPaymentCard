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

export const signAndSend = async (tag, password, amount, recipient, gas, sender) => {
  console.log('sign/send ran');
  console.log(sender);

  let { publicKey, privateKey } = await accountLogin(tag, password);
  const gasLimit = web3.utils.toHex(21000); // Example gas limit
  const gasPrice = web3.utils.toWei('100', 'gwei'); // Example gas price in wei (100 gwei)
  //const addressBuffer = web3.utils.keccak256(recipient); // Keccak-256 hash of the public key
  //const address = '0x' + addressBuffer.slice(-20).toString('hex'); // Take the last 20 bytes and convert to hex
  //const recipientAddress = web3.utils.toChecksumAddress(address); // Convert to checksum address
  const nonce = await web3.eth.getTransactionCount(publicKey);
  const amountInWei = web3.utils.toWei(amount, 'ether'); // Convert amount to wei
  const txObject = {
    from: publicKey,
    to: recipient,
    value: amountInWei,
    gas: gasLimit,
    gasPrice: gasPrice,
    nonce: nonce
  };
  const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);
  const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log(txReceipt)
  return txReceipt;
};