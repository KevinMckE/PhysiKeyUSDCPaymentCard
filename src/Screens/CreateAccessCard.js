import React from 'react';
import {View, StyleSheet, SafeAreaView, Platform, ImageBackground, NativeModules} from 'react-native';
import {Button, TextInput, Text, Chip} from 'react-native-paper';
import NfcManager, {Ndef, NfcTech, makeReadOnly} from 'react-native-nfc-manager';
import { randomBytes } from 'react-native-randombytes';

function CreateAccessCard(props) {
  const [tagValue, setTagValue] = React.useState('');

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
  }

  async function lockNFC() {

      try {
  
        await NfcManager.requestTechnology(NfcTech.Ndef);
        await NfcManager.ndefHandler.makeReadOnly();
        
      } catch (error) {
  
        console.error(error);
        
      } finally { 
        NfcManager.cancelTechnologyRequest();
        
      }
    }


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

  return (
      <View style={styles.wrapper}>
        <SafeAreaView />
        <View style={[styles.wrapper, styles.pad]}>

          <Text style={styles.bannerText}>
            
            {'\n'}Create Web 3 Access Card{'\n'}

          </Text>

          <Text style={styles.bannerText} selectable>
            
            {'\n'}{tagValue}{'\n'}

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
            style={styles.bigBtn} 
            onPress={lockNFC}
            >
            <Text style={styles.buttonText}>
              Lock Card Forever (Irreversible)
            </Text>
              
          </Button>
          
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

export default CreateAccessCard;