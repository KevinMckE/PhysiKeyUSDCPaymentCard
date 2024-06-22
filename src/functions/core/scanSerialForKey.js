import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import CryptoJS from 'crypto-js';
let kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, hasher: CryptoJS.algo.SHA256, iterations: 1024 });
let salt = 'BklcooclkncUhnaiianhUcnklcooclkB';

export const scanSerialForKey = async () => {
  try {
    await NfcManager.requestTechnology(NfcTech.NfcA);
    let tag = await NfcManager.getTag();
    let serialKey = kdf.compute(tag.id, salt).toString();
    return serialKey;
  } catch (error) {
    console.log('Cannot complete scanSerialForKey: ', error);
  } finally {
    NfcManager.cancelTechnologyRequest();
  }
};