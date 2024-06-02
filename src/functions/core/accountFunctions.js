import CryptoJS from 'crypto-js';
import argon2 from 'react-native-argon2';
import Web3 from 'web3';
const web3 = new Web3('https://sepolia.base.org');
const usdcABI = [{constant: true, inputs: [{ name: '_owner', type: 'address' }], name: 'balanceOf', outputs: [{ name: 'balance', type: 'uint256' }], type: 'function',},]
const usdcAddress = process.env.BASE_USDC_CONTRACT; 
const contract = new web3.eth.Contract(usdcABI, usdcAddress);
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

export const signTransaction = async (tag, password, amount, recipient) => {
  try {
    let { publicKey, encryptedPrivateKey, oneTimeEncryptionPW } = await accountLogin(tag, password);

    // Check sender's balance
    const balance = await web3.eth.getBalance(publicKey);
    const balanceInEth = web3.utils.fromWei(balance, 'ether');
    const amountInWei = web3.utils.toWei(amount, 'ether'); 
    const gasInEthRounded = parseFloat(balanceInEth).toFixed(6);
    
    if (gasInEthRounded < amount) {
      throw new Error("Insufficient funds to send the transaction.");
    }

    // Sufficient funds, proceed to sign the transaction
    const gasLimit = web3.utils.toHex(21000); // Example gas limit
    const gasPrice = web3.utils.toWei('100', 'gwei'); // Example gas price in wei (100 gwei)
    const nonce = await web3.eth.getTransactionCount(publicKey);
    const txObject = {
      from: publicKey,
      to: recipient,
      value: amountInWei,
      gas: gasLimit,
      gasPrice: gasPrice,
      nonce: nonce
    };
    const signedTx = await web3.eth.accounts.signTransaction(txObject, CryptoJS.AES.decrypt(encryptedPrivateKey, oneTimeEncryptionPW).toString(CryptoJS.enc.Utf8));
    return signedTx.rawTransaction; 
  } catch (error) {
    throw error; 
  }
};

export const sendSignedTransaction = async (signedTx) => {
  const txReceipt = await web3.eth.sendSignedTransaction(signedTx);
  console.log(txReceipt);
  return txReceipt;
};

export const signAndSend = async (tag, password, amount, recipient) => {
  let { publicKey, encryptedPrivateKey, oneTimeEncryptionPW } = await accountLogin(tag, password);
  const gasLimit = web3.utils.toHex(21000); 
  const gasPrice = web3.utils.toWei('100', 'gwei'); 
  const nonce = await web3.eth.getTransactionCount(publicKey);
  const amountInWei = web3.utils.toWei(amount, 'ether');
  const txObject = {
    from: publicKey,
    to: recipient,
    value: amountInWei,
    gas: gasLimit,
    gasPrice: gasPrice,
    nonce: nonce
  };
  const signedTx = await web3.eth.accounts.signTransaction(txObject, CryptoJS.AES.decrypt(encryptedPrivateKey, oneTimeEncryptionPW).toString(CryptoJS.enc.Utf8));
  const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log(txReceipt)
  return txReceipt;
};




