////////// FOR REFERENCE ////////////
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';
import CryptoJS from 'crypto-js';

////////// FOR REFERENCE ////////////
import Web3 from 'web3';
///var web3 = new Web3(Web3.givenProvider);
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

/** 
export const testLogin = (tag, date) => {
  let salt = 'BklcooclkncUhnaiianhUcnklcooclkB';
  let tempChain = tag;
  tempChain += date;
  let finalChain = kdf.compute(tempChain, salt).toString();
  tempChain = finalChain;

  const innerHash = web3.utils.keccak256(finalChain);
  let privateKey = web3.utils.keccak256(innerHash + finalChain);

  let oneTimeEncryptionPW = web3.utils.randomHex(32);
  let encryptedPrivateKey = CryptoJS.AES.encrypt(privateKey, oneTimeEncryptionPW).toString();
  let decryptedAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
  let publicKey = decryptedAccount.address;

  console.warn(encryptedPrivateKey);
  console.warn(oneTimeEncryptionPW);
  console.warn(publicKey);
};

*/
/***
 * var publicKey = '';
var encryptedPrivateKey = '';
var oneTimeEncryptionPW = '';
const ec = new EC('secp256k1');
let finalDataChain = ''; // append all inputValues to this variable
var tempDataChain = '';
var salt = 'BklcooclkncUhnaiianhUcnklcooclkB';
var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, hasher: CryptoJS.algo.SHA256, iterations: 1024 });
var web3 = new Web3(Web3.givenProvider);
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
  }

export const argonHash = (dataChain, salt) => {
    const argonResult = await argon2(
        dataChain,
        salt,
        {
          iterations:5,
          memory: 65536,
          parallelism: 2,
          mode: 'argon2id'
        }
      ); 

}


// the date and Tag ID will be available

      tempDataChain += tag.id;
      tempDataChain += account;



              const innerHash = web3.utils.keccak256(finalDataChain);
              var privateKey = web3.utils.keccak256(innerHash + finalDataChain);

              oneTimeEncryptionPW = web3.utils.randomHex(32);
              encryptedPrivateKey = CryptoJS.AES.encrypt(privateKey, oneTimeEncryptionPW).toString();;
              var decryptedAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
              publicKey = decryptedAccount.address;

              setInputTagValues(encryptedPrivateKey);
              console.warn(encryptedPrivateKey);
              console.warn(oneTimeEncryptionPW);
              console.warn(publicKey);
              

              // reset all values containing sensitive data to null / baseline:
              decryptedAccount = {};
              privateKey = '';
              finalDataChain = ''; //clear finalDataChain
              tempDataChain = '';  

                      setInputTextValues('');
                      setInputTagValues('');
                      const data = { publicKey, oneTimeEncryptionPW, encryptedPrivateKey };
                      navigation.navigate('Concept App Account Display', { data });

   

    hideScanModal();

  }


  if (inputCheck === finalDataChain){

    showKeyStatusModal();

    console.warn('temp data chain before argon: ' + tempDataChain);
    const argonResult = await argon2(
      tempDataChain,
      salt,
      {
        iterations:5,
        memory: 65536,
        parallelism: 2,
        mode: 'argon2id'
      }
    ); 
    console.warn(argonResult);
    finalDataChain = argonResult.rawHash;

    const innerHash = web3.utils.keccak256(finalDataChain);
    var privateKey = web3.utils.keccak256(innerHash + finalDataChain);

    oneTimeEncryptionPW = web3.utils.randomHex(32);
    encryptedPrivateKey = CryptoJS.AES.encrypt(privateKey, oneTimeEncryptionPW).toString();;
    var decryptedAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
    publicKey = decryptedAccount.address;

    setInputTagValues(encryptedPrivateKey);
    console.warn(encryptedPrivateKey);
    console.warn(oneTimeEncryptionPW);

    // reset all values containing sensitive data to null / baseline:
    decryptedAccount = {};
    privateKey = '';
    finalDataChain = ''; //clear finalDataChain
    tempDataChain = '';
    inputCheck = '';
 */