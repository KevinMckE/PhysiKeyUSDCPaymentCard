import NfcManager, { NfcTech } from 'react-native-nfc-manager';

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