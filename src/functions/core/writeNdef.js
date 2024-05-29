import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';

export const writeNdef = async () => {
  try {
    await NfcManager.start();
    await NfcManager.requestTechnology(NfcTech.Ndef);
    const bytes = Ndef.encodeMessage([Ndef.textRecord(dataToWrite)]);
    const tag = await NfcManager.getTag();
    await NfcManager.writeNdefMessage(bytes);
    console.log('Completed writeNdef: ', dataToWrite);
    await NfcManager.closeTechnology();
    await NfcManager.stop();
  } catch (error) {
    console.error('Cannot complete writeNdef: ', error);
  }
};