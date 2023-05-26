import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ImageBackground} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';
import sha256 from 'crypto-js/sha256';
import * as secp from "noble-secp256k1";
import '../../shim.js';
import Web3 from 'web3';

let finalDataChain = ''; // append all values to this variable
var web3 = new Web3(Web3.givenProvider);

function KeyGen() {

  const [value, setValue] = React.useState();

  function renderNfcButtons() {

    return(

      <View style={styles.bottom}>
        <Button 
        mode="contained" 
        style={[styles.btn]}
        onPress={() => {
          readNdef();
        }}>
          Input Link Phrase
        </Button>
        <Button 
        mode="contained" 
        style={styles.btn} 
        onPress={() => {
            console.warn(finalDataChain);
            // insert go to done screen to print private/public key pair;
          }
        }>
          Check Password
        </Button>
        <Button 
        mode="contained" 
        style={styles.btn} 
        onPress={() => {
            const accountObject = web3.eth.accounts.create(finalDataChain);
            console.warn("Private Key Test: " + accountObject.privateKey + "   Public Key: " + accountObject.address);

            //const privateKey = sha256(finalDataChain);
            //const publicKey = secp.getPublicKey(privateKey.toString());
            // insert go to done screen to print private/public key pair;
            // when you do the comparison, only store the public key, so the private key isn't in memory until verifcation

            finalDataChain = ''; //clear finalDataChain
          }
        }>
          Access Account
        </Button>
      </View>
    )

  }

  //userInput();

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
        <View style={styles.wrapper}>
          <Text style={styles.bannerText}>
          Account
          {'\n'}
          Portal
          </Text>
        </View>
          <View style={[styles.textInput]}>
          <TextInput
            label="INPUT LINK CHAIN"
            value={value}
            onChangeText={setValue}
            autoCapitalize={false}
            backgroundColor={'white'}
            color={'black'}
          />
          
          <Button 
            mode="contained" 
            style={styles.btn} 
            onPress={() => {
            finalDataChain += value;
            }}>
            Input Link Chain
          </Button>
          </View>
        {renderNfcButtons()}
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

export default KeyGen;
