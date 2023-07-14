import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ImageBackground, Modal} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';
import '../../shimeth.js';
import '../../shim.js';
import Bitcoin  from 'react-native-bitcoinjs-lib';
import Web3 from 'web3';
import { createHash } from 'react-native-crypto';
import { ec as EC } from 'elliptic';


let finalDataChain = 'anywarewallet'; // append all inputValues to this variable
var web3 = new Web3(Web3.givenProvider);
var privateKeyETH = '';
var publicKeyETH = '';
var privateKeyBTC = '';
var publicKeyBTC = '';

function RawKeys(props) {

  const [inputValue='', setInputValues] = React.useState();
  const [modalVisible=false, setModalVisible] = React.useState();
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

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
            autoComplete='off'
            autoCorrect={false}
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

        </View>

        <View style={styles.bottom}>
        
        <Button 
        mode="contained" 
        style={styles.btn} 
        onPress={() => {

          // Eth address creation:
          const innerHash = web3.utils.keccak256(finalDataChain);
          privateKeyETH = web3.utils.keccak256(innerHash + finalDataChain);

          const accountObject = web3.eth.accounts.privateKeyToAccount(privateKeyETH);
          publicKeyETH = accountObject.address;

          console.warn("ETH Private Key Test: " + accountObject.privateKey + "   ETH Public Key: " + accountObject.address);

          //BTC address creation:

          const sha256 = (message) => createHash('sha256').update(message).digest();

          const generateKeyPair = () => {
            const ec = new EC('secp256k1');
            const firstHash = sha256(finalDataChain);
            privateKeyBTC = sha256(firstHash + finalDataChain);
            publicKeyBTC = ec.keyFromPrivate(privateKeyBTC).getPublic();
            return { privateKeyBTC: privateKeyBTC.toString('hex'), publicKeyBTC: publicKeyBTC.toString('hex') };
          };

          privateKeyBTC, publicKeyBTC = generateKeyPair();
          console.warn("BTC Private Key: " + privateKeyBTC + "   BTC Public Key: " + publicKeyBTC);

          
            

          finalDataChain = 'anywarewallet'; //clear finalDataChain

          const keypair = Bitcoin.ECPair.makeRandom();
          console.warn(keypair.getAddress());

          // insert modal to done screen to print private/public key pair;
          showModal();

          }
        }>
          Show Raw Keys
        </Button>

        <Modal  
        visible = {modalVisible}>
          <View 
            backgroundColor={'black'}
            style={styles.wrapper}
            borderRadius={10}>
          <Text style={styles.bannerText}>
            Private Key:
            {'\n'}
            {privateKeyETH}
            {'\n'}
            Public Key: 
            {'\n'}
            {publicKeyETH}
            {'\n'}
          </Text>
          <Button 
            mode="contained"
            style={styles.btn}
            onPress={hideModal}>
            Hide Keys
          </Button>
          </View>
        </Modal>

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
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    fontVariant: 'small-caps',
    fontWeight: 'bold',
    padding: 20,
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
  modal: {
    flex: 1,
    backgroundColor: 'green',
    margin: 50,
    padding: 40,
    borderRadius: 10,
  }
});

export default RawKeys;
