import React from 'react';
import {View, StyleSheet, SafeAreaView, Platform, ImageBackground, NativeModules} from 'react-native';
import {Button, TextInput, Text, Chip} from 'react-native-paper';
import NfcManager, {Ndef, NfcTech, makeReadOnly} from 'react-native-nfc-manager';
import { randomBytes } from 'react-native-randombytes';

function ManageAccessCards(props) {
  const {navigation} = props;
  const [tagValue='---', setTagValue] = React.useState('');
  const [isLocked='---', setIsLocked] = React.useState('');
  const [readTagValue='---', setReadTagValue] = React.useState('');

  async function writeNdef() {
    let scheme = '';
    const nfcInput = Ndef.uriRecord(`${scheme}${tagValue}`);
    const bytes = Ndef.encodeMessage([nfcInput]);
    //console.warn(bytes);

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      await NfcManager.ndefHandler.writeNdefMessage(bytes);
    } catch (error) {
      console.error(error);
      // bypass
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
    setReadTagValue('---');
  }

  async function readCardCode() {
    try{
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // Testing just to get the Ndef data
      const tagData = await NfcManager.ndefHandler.getNdefMessage();
      
      // turns payload into a single string of numbers with ,'s:
      const tagPayload = tagData.ndefMessage[0].payload; //isolates payload of the ndefmessage
      tagPayload.shift(); // removes the 0th index of the tagPayload so it is only the record written to the tag

      // turns the NDEF record into a string
      const ndefString = String.fromCharCode(...tagPayload);

      setReadTagValue(ndefString);

    } catch (ex) {
        //bypass
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  }

  async function lockNFC() {

        try {
    
          await NfcManager.requestTechnology(NfcTech.NfcA);
          await enablePassword();
          
        } catch (error) {
    
          console.error(error);
          
        } finally { 
          NfcManager.cancelTechnologyRequest();
          setIsLocked('Locked');
          
        }
  }

  async function unlockNFC() {

          try {
      
            await NfcManager.requestTechnology(NfcTech.NfcA);
            await disablePassword();
            
          } catch (error) {
      
            console.error(error);
            
          } finally { 
            NfcManager.cancelTechnologyRequest();
            setIsLocked('Unlocked');

          }
  }

  // code written from newline course developer Whitedogg13
  async function enablePassword() {

    const password = [0x12, 0x34, 0xab, 0xcd];
    const pack = [0xaa, 0xbb];

    let respBytes = null;
    let writeRespBytes = null;
    let authPageIdx;

    // check if this is NTAG 213 or NTAG 215
    respBytes = await NfcManager.nfcAHandler.transceive([0x30, 0]);
    const cc2 = respBytes[14];
    if (cc2 * 8 > 256) {
      authPageIdx = 131; // NTAG 215
    } else {
      authPageIdx = 41; // NTAG 213
    }

    // check if AUTH is enabled
    respBytes = await NfcManager.nfcAHandler.transceive([0x30, authPageIdx]);
    const auth = respBytes[3];

    if (auth === 255) {
      // configure the tag to support password protection
      writeRespBytes = await NfcManager.nfcAHandler.transceive([
        0xa2,
        authPageIdx + 3,
        ...pack,
        respBytes[14],
        respBytes[15],
      ]);

      writeRespBytes = await NfcManager.nfcAHandler.transceive([
        0xa2,
        authPageIdx + 2,
        ...password,
      ]);

      writeRespBytes = await NfcManager.nfcAHandler.transceive([
        0xa2,
        authPageIdx + 1,
        respBytes[4] & 0x7f,
        respBytes[5],
        respBytes[6],
        respBytes[7],
      ]);

      writeRespBytes = await NfcManager.nfcAHandler.transceive([
        0xa2,
        authPageIdx,
        respBytes[0],
        respBytes[1],
        respBytes[2],
        4,
      ]);
    } else {
      // send password to NFC tags, so we can perform write operations
      writeRespBytes = await NfcManager.nfcAHandler.transceive([
        0x1b,
        ...password,
      ]);
      if (writeRespBytes[0] !== pack[0] || writeRespBytes[1] !== pack[1]) {
        throw new Error("incorrect password");
      }
    }
  }

  async function disablePassword() {
    
      const password = [0x12, 0x34, 0xab, 0xcd];
      const pack = [0xaa, 0xbb];

      const passwordFormat = [0x00, 0x00, 0x00, 0x00];
      const packFormat = [0x00, 0x00];

      let respBytes = null;
      let writeRespBytes = null;
      let authPageIdx;

      // check if this is NTAG 213 or NTAG 215
      respBytes = await NfcManager.nfcAHandler.transceive([0x30, 0]);
      const cc2 = respBytes[14];
      if (cc2 * 8 > 256) {
        authPageIdx = 131; // NTAG 215
      } else {
        authPageIdx = 41; // NTAG 213
      } // May need to add another value if you want to enable NTAG 216 also

       // get respBytes Array and set auth 
      respBytes = await NfcManager.nfcAHandler.transceive([0x30, authPageIdx]);
      const auth = respBytes[3];

      if(auth===4){

        writeRespBytes = await NfcManager.nfcAHandler.transceive([
          0x1b,
          ...password,
        ]);
        console.warn(writeRespBytes);
        if (writeRespBytes[0] !== pack[0] || writeRespBytes[1] !== pack[1]) {
          throw new Error("incorrect password");
        }

        // disable password protection
        writeRespBytes = await NfcManager.nfcAHandler.transceive([
          0xa2,
          authPageIdx + 3,
          ...packFormat,
          respBytes[14],
          respBytes[15],
        ]);

        writeRespBytes = await NfcManager.nfcAHandler.transceive([
          0xa2,
          authPageIdx + 2,
          ...passwordFormat,
        ]);

        writeRespBytes = await NfcManager.nfcAHandler.transceive([
          0xa2,
          authPageIdx + 1,
          respBytes[4] & 0x7f, // Why does this have 0x7f? May need to look at the datasheets
          respBytes[5],
          respBytes[6],
          respBytes[7],
        ]);

        writeRespBytes = await NfcManager.nfcAHandler.transceive([
          0xa2,
          authPageIdx,
          respBytes[0],
          respBytes[1],
          respBytes[2],
          255,
        ]);

      }

  } 

  return (
      <View style={styles.wrapper}>
        <SafeAreaView />
        <View style={[styles.wrapper, styles.pad]}>

          <Text style={styles.bannerText}>
            
            {'\n'}Generated Web 3 Access Code:

          </Text>

          <Text style={styles.bannerText} selectable>
            
            {tagValue}{'\n'}

          </Text>

          <Button 
            mode="contained" 
            style={styles.bigBtn} 
            onPress={ async () => {
              
              const randVal = randomBytes(16).toString('hex');
              console.warn(randVal);
              setTagValue(randVal);
              // create a random value and pass it to the settagvalue
              }
            }>
            <Text style={styles.buttonText}>
              Create Access Code
            </Text>
            
          </Button>
      
          <Button 
            mode="contained" 
            style={styles.bigBtn} 
            onPress={writeNdef}
            >
            <Text style={styles.buttonText}>
              Write Code to Card
            </Text>
              
          </Button>

          <Button 
            mode="contained" 
            style={styles.smallBtn} 
            onPress={lockNFC}
            >
            <Text style={styles.buttonText}>
              Lock Card
            </Text>
              
          </Button>

          <Button 
            mode="contained" 
            style={styles.smallBtn} 
            onPress={unlockNFC}
            >
            <Text style={styles.buttonText}>
              Unlock Card
            </Text>
              
          </Button>

          <Button 
            mode="contained" 
            style={styles.smallBtn} 
            onPress={readCardCode}
            >
            <Text style={styles.buttonText}>
              Check Card Status
            </Text>
              
          </Button>

          <Text style={styles.bannerText}>
            
            {'\n'}Card Status:

          </Text>

          <Text style={styles.bannerText} selectable>
            
            Access Code: {readTagValue}{'\n'}
            Card Lock: {isLocked}{'\n'}

          </Text>
          
        </View>
        <SafeAreaView/>
      </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  textInput: {
    paddingHorizontal: 20,
  },
  bannerText: {
    fontSize: 20,
    textAlign: 'center',
    color: 'black',
    fontVariant: 'small-caps',
    fontWeight: 'bold',
    padding: 20,
  },
  bottom: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  smallBtn: {
    width: 200,
    height: 50,
    marginBottom: 15,
    color: 'white',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigBtn: {
    width: 250,
    height: 70,
    marginBottom: 15,
    color: 'white',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    fontVariant: 'small-caps',
  },
  modal: {
    flex: 1,
    backgroundColor: 'green',
    margin: 50,
    padding: 40,
    borderRadius: 10,
  }
});

export default ManageAccessCards;





// potentially useful code:

// async function lockNFC() {

  //     try {
  
  //       await NfcManager.requestTechnology(NfcTech.Ndef);
  //       await NfcManager.ndefHandler.makeReadOnly();
        
  //     } catch (error) {
  
  //       console.error(error);
        
  //     } finally { 
  //       NfcManager.cancelTechnologyRequest();
        
  //     }
  //   }

  //  trying to use the NativeModules stuff:
  // async function lockNFC() {

  //   try {

  //     await NativeModules.NfcManager.requestTechnology([NfcTech.Ndef], (error, result) => {

  //         if (error) {
  //             console.error('Error making tag read-only:', error);
  //         } else {
  //             console.log('Tag made read-only:', result);
  //         }
  //       }) ;

  //     await NativeModules.NfcManager.makeReadOnly((error, result) => {

  //         if (error) {
  //             console.error('Error making tag read-only:', error);
  //         } else {
  //             console.log('Tag made read-only:', result);
  //         }
  //       });
      
  //   } catch (error) {

  //     console.error(error.message);
      
  //   } finally { 
  //     NativeModules.NfcManager.cancelTechnologyRequest();
      
  //   }
  // }