import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ImageBackground, Modal} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';
import '../../shimeth.js';
import '../../shim.js';
import Web3 from 'web3';
import CryptoJS from 'crypto-js';
import { ec as EC } from 'elliptic';
import wif from 'wif';
import * as bitcoin from 'bitcoinjs-lib';


let finalDataChain = 'anywarewallet'; // append all inputValues to this variable
var web3 = new Web3(Web3.givenProvider);
var privateKeyETH = '';
var publicKeyETH = '';
var privateKeyBTC = '';
var addressBTC = '';
const ec = new EC('secp256k1');
const testnet = bitcoin.networks.testnet;

function RawKeys(props) {
  const {navigation} = props;

  const [inputTextValue='', setInputTextValues] = React.useState();
  const [inputTagValue='', setInputTagValues] = React.useState();
  const [modalVisible=false, setModalVisible] = React.useState();
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  //userInput();
  async function writeNdef() {
    let scheme = '';
    const nfcInput = Ndef.uriRecord(`${scheme}${inputTagValue}`);
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
      
      // turns payload into a single string of numbers with ,'s:
      const tagPayload = tagData.ndefMessage[0].payload; //isolates payload of the ndefmessage
      tagPayload.shift(); // removes the 0th index of the tagPayload so it is only the record written to the tag

      const sum = tagPayload.reduce((acc, curr) => acc + curr, 0);

      finalDataChain += tagPayload + sum;

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

          <Text styles={styles.bannerText}> {finalDataChain} </Text>

          <TextInput
            label="Add Raw Text to Pass Phrase Input"
            autoComplete='off'
            autoCorrect={false}
            inputValue={inputTextValue}
            onChangeText={setInputTextValues}
            autoCapitalize={false}
            backgroundColor={'white'}
            color={'black'}
          />
          
          <Button 
            mode="contained" 
            style={styles.btn} 
            onPress={() => {
            finalDataChain += inputTextValue;
            }}>
            Add to Input
          </Button>

          <Button 
            mode="contained" 
            style={styles.btn} 
            onPress={() => {
            for (let i = 0; i < inputTextValue.length; i++) {
              finalDataChain += inputTextValue.charCodeAt(i);
              finalDataChain += inputTextValue.charAt(i);
            }
            }}>
            Add as Numbers to Input
          </Button>

          <TextInput
            label="Write Encoded Text to Tag"
            autoComplete='off'
            autoCorrect={false}
            inputValue={inputTagValue}
            onChangeText={setInputTagValues}
            autoCapitalize={false}
            backgroundColor={'white'}
            color={'black'}
          />

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

          var accountObjectETH = web3.eth.accounts.privateKeyToAccount(privateKeyETH);
          publicKeyETH = accountObjectETH.address;

          console.warn("ETH Private Key Test: " + accountObjectETH.privateKey + "   ETH Public Key: " + accountObjectETH.address);

          //BTC address creation:

          const firstHash = CryptoJS.SHA256(finalDataChain).toString();
          privateKeyBTC = CryptoJS.SHA256(firstHash + finalDataChain).toString();

          // wif encoding privateKeyBTC = wif.encode(128, Buffer.from(secondHash, 'hex'), true);
          var accountObjectBTC = ec.keyFromPrivate(privateKeyBTC);
          addressBTC = accountObjectBTC.getPublic('hex');

          var compressedPublicKeyBTC = accountObjectBTC.getPublic(true, 'hex'); // Compressed public key

          var { address } = bitcoin.payments.p2wpkh({ pubkey: Buffer.from(compressedPublicKeyBTC, 'hex'), network: testnet });

          console.warn("BTC Private Key: " + privateKeyBTC + "   Address: " + addressBTC + "SegWit: " + address);

          finalDataChain = 'anywarewallet'; //clear finalDataChain
          accountObjectBTC = null;
          accountObjectETH = null;

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
          <Text style={styles.bannerText} selectable>
            BTC Private Key(WIF Format):
            {'\n'}
            {privateKeyBTC}
            {'\n'}
            BTC Address(WIF Format): 
            {'\n'}
            {addressBTC}
            {'\n'}
            ETH Private Key:
            {'\n'}
            {privateKeyETH}
            {'\n'}
            ETH Public Key: 
            {'\n'}
            {publicKeyETH}
            {'\n'}
          </Text>
          <Button 
            mode="contained"
            style={styles.btn}
            onPress={() => {
            navigation.navigate('Home');
            }}>
            Start Over
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
