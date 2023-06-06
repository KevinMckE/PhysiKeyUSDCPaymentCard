import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ImageBackground} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';
import '../../shim.js';
import Web3 from 'web3';

let finalDataChain = 'anywarewallet'; // append all inputValues to this variable
var web3 = new Web3(Web3.givenProvider);

function AccountPortal(props) {
  const {navigation} = props;

  const [inputValue, setInputValues] = React.useState();

  //userInput();
  async function writeNdef() {
    let scheme = '';
    const nfcInput = Ndef.uriRecord(`${scheme}${inputValue}`);
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

  async function readNdef() {
    try{
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // Testing just to get the Ndef data
      const tagData = await NfcManager.ndefHandler.getNdefMessage();

      //console.warn({tagData}); //print whole tag data
      //console.log(tagData.ndefMessage[0].payload); // print only payload
      
      // turns payload into a single string of numbers without ,'s:
      const tagPayload = tagData.ndefMessage[0].payload; //isolates payload of the ndefmessage
      
      tagPayload.shift(); // removes the 0th index of the tagPayload so it is only the record written to the tag
      let nfcRead = await tagPayload.join(''); // concats the string of the tagPayload into a single string of #s

      //console.warn(nfcRead); //print the information read from the tag

      finalDataChain += nfcRead;

    } catch (ex) {
        //bypass
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  }

  return (
    <ImageBackground source={require('../assets/AnyWareBackground.png')}
    style={styles.backgroundImage}>
      <View style={styles.wrapper}>
          <View style={[styles.textInput]}>

          <TextInput
            label="Add Text to Input or Tag"
            inputValue={inputValue}
            onChangeText={setInputValues}
            autoCapitalize={false}
            backgroundColor={'white'}
            color={'black'}
          />
          
          <Button 
            mode="contained" 
            style={styles.btn} 
            onPress={() => {
            finalDataChain += inputValue;
            }}>
            Add to Input
          </Button>

          <Button 
            mode="contained" 
            style={styles.btn} 
            onPress={writeNdef}
            >
              Write to Tag
          </Button>

          </View>

        <View style={styles.bottom}>
        <Button 
        mode="contained" 
        style={[styles.btn]}
        onPress={() => {
          readNdef();
        }}>
          Input From Tag
        </Button>
        
        <Button 
        mode="contained" 
        style={styles.btn} 
        onPress={() => {
            console.warn(finalDataChain);
            // insert go to done screen to print private/public key pair;
          }
        }>
          Check Input
        </Button>

        <Button 
        mode="contained" 
        style={styles.btn} 
        onPress={() => {

          const innerHash = web3.utils.keccak256(finalDataChain);
          const privateKey = web3.utils.keccak256(innerHash + finalDataChain);

          const accountObject = web3.eth.accounts.privateKeyToAccount(privateKey);
          console.warn("Private Key Test: " + accountObject.privateKey + "   Public Key: " + accountObject.address);

            // need encryption of private key, and need to pass encryption password to Account Display
            // insert modal to done screen to print private/public key pair;
            // when you do the comparison, only store the public key, so the private key isn't in memory until verifcation

            finalDataChain = 'anywarewallet'; //clear finalDataChain

            navigation.navigate('Account Display'); //go to account display screen
          }
        }>
          Access Account
        </Button>
      </View>

      </View>
    </ImageBackground>
    );

}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
  },
  textInput: {
    padding: 20,
  },
  bannerText: {
    fontSize: 42,
    textAlign: 'center',
    color: 'white',
    fontVariant: 'small-caps',
    fontWeight: 'bold',
  },
  bottom: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  btn: {
    width: 250,
    marginBottom: 15,
    color: 'black',
    backgroundColor: 'white',
  },
});

export default AccountPortal;
