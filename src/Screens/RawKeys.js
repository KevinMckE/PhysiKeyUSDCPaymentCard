import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ImageBackground, Modal} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';
import '../../shimeth.js';
import '../../shim.js';
import Web3 from 'web3';
import CryptoJS from 'crypto-js';
import { ec as EC } from 'elliptic';
import * as bitcoin from 'bitcoinjs-lib';
import argon2 from 'react-native-argon2';


let finalDataChain = ''; // append all inputValues to this variable
var tempDataChain = '';
var salt = 'BklcooclkncUhnaiianhUcnklcooclkB';
var web3 = new Web3(Web3.givenProvider);
var privateKeyETH = '';
var publicKeyETH = '';
var privateKeyBTC = '';
var addressBTC = '';
var addressNativeSegWit = '';
var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, hasher: CryptoJS.algo.SHA256, iterations: 1024 });
const ec = new EC('secp256k1');
const testnet = bitcoin.networks.testnet;

function RawKeys(props) {
  const {navigation} = props;

  const [inputTextValue='', setInputTextValues] = React.useState();
  const [inputTagValue='', setInputTagValues] = React.useState();

  const [modalVisible=false, setModalVisible] = React.useState();
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const [textCount, setTextCount] = React.useState(0);
  const [numCount, setNumCount] = React.useState(0);
  const [tagCount, setTagCount] = React.useState(0);

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

      tempDataChain += tagPayload + sum;
      console.warn(tempDataChain);

    } catch (ex) {
        //bypass
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  }

  return (
      <View style={styles.wrapper}>
      <Text style={styles.bannerText}>
        
        Input Count: 
        {'\n'}
        Text: {textCount}
        {' '}Num: {numCount}
        {' '}Tag: {tagCount}

        
        </Text>
        <View style={[styles.textInput]}>

          <TextInput
            style={styles.textInput}
            label="Add Text to Input"
            autoComplete='off'
            autoCorrect={false}
            inputValue={inputTextValue}
            onChangeText={setInputTextValues}
            autoCapitalize={false}
            backgroundColor={'grey'}
            color={'white'}
            returnKeyType={'done'}
          />
          
          <Button 
            mode="contained" 
            style={styles.smallBtn} 
            onPress={() => {
              tempDataChain += inputTextValue;
              console.warn(tempDataChain);
              finalDataChain += kdf.compute(tempDataChain, salt).toString();
              console.warn(finalDataChain);
              tempDataChain = finalDataChain;
              setTextCount(textCount+1); // plain text input count ++
            }
            }>
            <Text style={styles.buttonText}>
              Raw Text Input
            </Text>
          </Button>

          <Button 
            mode="contained" 
            style={styles.smallBtn} 
            onPress={() => {
            for (let i = 0; i < inputTextValue.length; i++) {
              tempDataChain += inputTextValue.charCodeAt(i);
              tempDataChain += inputTextValue.charAt(i); 
            }
            console.warn(tempDataChain);
            finalDataChain += kdf.compute(tempDataChain, salt).toString();
            console.warn(finalDataChain);
            tempDataChain = finalDataChain;
            setNumCount(numCount+1); //Encoded input count ++
            }}>
            <Text style={styles.buttonText}>
              Encoded Input
            </Text>
          </Button>

          <TextInput
            style={styles.textInput}
            label="Add Text to Tag"
            autoComplete='off'
            autoCorrect={false}
            inputValue={inputTagValue}
            onChangeText={setInputTagValues}
            autoCapitalize={false}
            backgroundColor={'grey'}
            color={'white'}
            returnKeyType={'done'}
          />

          <Button 
            mode="contained" 
            style={styles.smallBtn} 
            onPress={writeNdef}
            >
            <Text style={styles.buttonText}>
              Write To Tag
            </Text>
          </Button>

          <Button 
          mode="contained" 
          style={[styles.smallBtn]}
          onPress={ async () => {
            await readNdef();
            finalDataChain += kdf.compute(tempDataChain, salt).toString();
            console.warn(finalDataChain);
            tempDataChain = finalDataChain;
            setTagCount(tagCount+1); // Tag input count ++
          }}>
            <Text style={styles.buttonText}>
              Input From Tag
            </Text>
          </Button>

        </View>

        <View style={styles.bottom}>

        <Button 
          mode="contained" 
          style={styles.bigBtn} 
          onPress={() => {
              console.warn(finalDataChain);
              console.warn(tempDataChain);
              // insert go to done screen to print private/public key pair;
            }
          }>
            <Text style={styles.buttonText}>
              Check Input
            </Text>
          </Button>
        
        <Button 
        mode="contained" 
        style={styles.bigBtn} 
        onPress={ async () => {

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
          addressNativeSegWit = address;

          console.warn("BTC Private Key: " + privateKeyBTC + "   Address: " + addressBTC + "SegWit: " + address);

          finalDataChain = ''; //clear finalDataChain
          tempDataChain = ''; //clear tempDataChain
          accountObjectBTC = null;
          accountObjectETH = null;

          // insert modal to done screen to print private/public key pair;
          showModal();

          }
        }>
          <Text style={styles.buttonText}>
              Show Raw Keys
          </Text>
        </Button>

        <Modal  
        visible = {modalVisible}>
          <View 
            backgroundColor={'white'}
            style={styles.wrapper}
            borderRadius={10}>
          <Text style={styles.bannerText} selectable>
            BTC Address(WIF Format): 
            {'\n'}
            {addressBTC}
          </Text>
          <Text style={styles.bannerText} selectable>
            BTC Address(Native SegWit): 
            {'\n'}
            {addressNativeSegWit}
          </Text>
          <Text style={styles.bannerText} selectable>
            BTC Private Key(WIF Format):
            {'\n'}
            {privateKeyBTC}
          </Text>
          <Text style={styles.bannerText} selectable>
            ETH Public Key: 
            {'\n'}
            {publicKeyETH}
          </Text>
          <Text style={styles.bannerText} selectable>
            ETH Private Key:
            {'\n'}
            {privateKeyETH}
            {'\n'}
          </Text>
          <Button 
            mode="contained"
            style={styles.bigBtn}
            onPress={() => {
            navigation.navigate('Home');
            }}>
            <Text style={styles.buttonText}>
              Start Over
            </Text>
          </Button>
          </View>
        </Modal>

      </View>

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

export default RawKeys;
