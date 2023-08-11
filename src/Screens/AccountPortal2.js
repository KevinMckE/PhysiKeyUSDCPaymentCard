import React from 'react';
import {Alert, View, Text, StyleSheet, TouchableOpacity, ImageBackground, Modal} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import '../../shimeth.js';
import '../../shim.js';
import Web3 from 'web3';
import CryptoJS from 'crypto-js';
import { ec as EC } from 'elliptic';
import * as bitcoin from 'bitcoinjs-lib';


var publicKey = '';
var encryptedPrivateKey = '';
var oneTimeEncryptionPW = '';
const ec = new EC('secp256k1');
let finalDataChain = 'anywarewallet'; // append all inputValues to this variable
const testnet = bitcoin.networks.testnet;

function AccountPortal2(props) {
  const {navigation} = props;

  const route = useRoute();
  let inputCheck = route.params.data;
  
  var web3 = new Web3(Web3.givenProvider);
  
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
    <View style={styles.wrapper}>
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
            finalDataChain += inputTextValue;
            }}>
            <Text style={styles.buttonText}>
              Raw Text Input
            </Text>
          </Button>

          <Button 
            mode="contained" 
            style={styles.smallBtn} 
            onPress={() => {
            for (let i = 0; i < inputTextValue.length; i++) {
              finalDataChain += inputTextValue.charCodeAt(i);
              finalDataChain += inputTextValue.charAt(i);
            }
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
          onPress={() => {
            readNdef();
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
          onPress={ () => {

            if (inputCheck === finalDataChain){

              const innerHash = web3.utils.keccak256(finalDataChain);
              var privateKey = web3.utils.keccak256(innerHash + finalDataChain);

              oneTimeEncryptionPW = web3.utils.randomHex(32);
              encryptedPrivateKey = CryptoJS.AES.encrypt(privateKey, oneTimeEncryptionPW).toString();;
              var decryptedAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
              publicKey = decryptedAccount.address;

              setInputTagValues(encryptedPrivateKey);
              console.warn(encryptedPrivateKey);
              console.warn(oneTimeEncryptionPW);

              // reset all values containing sensitive data to null / baseline:
              decryptedAccount = {};
              privateKey = '';
              finalDataChain = 'anywarewallet'; //clear finalDataChain
              inputCheck = '';

              //console.warn(encryptedPrivateKey);

                // need encryption of private key, and need to pass encryption password to Account Display
                // insert modal to done screen to print private/public key pair;
                // when you do the comparison, only store the public key, so the private key isn't in memory until verifcation

              showModal();
            }
            else{
              console.warn('Inputs did not match, try again');
              console.warn(inputCheck + " _ " + finalDataChain);
            }
          }
        }>
          <Text style={styles.buttonText}>
            Access ETH
          </Text>
        </Button>

        <Button 
          mode="contained" 
          style={styles.bigBtn} 
          onPress={ () => {

            if (inputCheck === finalDataChain){

              const firstHash = CryptoJS.SHA256(finalDataChain).toString();
              privateKey = CryptoJS.SHA256(firstHash + finalDataChain).toString();

              oneTimeEncryptionPW = web3.utils.randomHex(32);
              encryptedPrivateKey = CryptoJS.AES.encrypt(privateKey, oneTimeEncryptionPW).toString();
              var keyPairBTC = ec.keyFromPrivate(privateKey);
              var compressedPublicKeyBTC = keyPairBTC.getPublic(true, 'hex'); // Compressed public key

              var { address } = bitcoin.payments.p2wpkh({ pubkey: Buffer.from(compressedPublicKeyBTC, 'hex'), network: testnet });
              publicKey = address;

              setInputTagValues(encryptedPrivateKey);
              console.warn(privateKey);
              console.warn(publicKey);
              console.warn(encryptedPrivateKey);
              console.warn(oneTimeEncryptionPW);

              // reset all values containing sensitive data to null / baseline:
              keyPairBTC = {};
              privateKey = '';
              finalDataChain = 'anywarewallet'; //clear finalDataChain
              inputCheck = '';

              //console.warn(encryptedPrivateKey);

                // need encryption of private key, and need to pass encryption password to Account Display
                // insert modal to done screen to print private/public key pair;
                // when you do the comparison, only store the public key, so the private key isn't in memory until verifcation

              showModal();
            } else {
              console.warn('Inputs did not match, try again.');
              console.warn(inputCheck + " _ " + finalDataChain);
            }

          }
        }>
          <Text style={styles.buttonText}>
            Access BTC
          </Text>
        </Button>

        <Button 
            mode="contained"
            style={styles.smallBtn}
            onPress={() => {
            navigation.navigate('Home');
            }}>
            <Text style={styles.buttonText}>
              Start Over
            </Text>        
        </Button>
        

      <Modal  
        visible = {modalVisible}>
          <View 
            backgroundColor={'black'}
            style={styles.wrapper}
            borderRadius={10}>
          <Text style={styles.bannerText} selectable>Public Key:{publicKey}</Text>
          
          <Button // this button needs to write the encrypted private key to the tag
                  // then navigate to the account display while passing the
                  // onetimeencryption password and the public key into the next screen
            mode="contained"
            style={styles.bigBtn}
            onPress={() => {
              // this needs to try to write the JSON file to the tag, if successful then navigate to account display
              // if not successful, hide modal, clear passwords, and display error message
              
              writeNdef();
              encryptedPrivateKey = '';
              setInputTextValues('');
              setInputTagValues('');

              const data = { publicKey, oneTimeEncryptionPW, encryptedPrivateKey };
              hideModal();

              if(publicKey.startsWith('0x')){
                navigation.navigate('Account Display', { data });
              } else { 
                navigation.navigate('Account Display BTC', { data });
              }
            }}>
            <Text style={styles.buttonText}>
              Sign With Tag
            </Text>
            
          </Button>

          <Button // this button needs to store the JSON for later use and navigate to 
                  // the account display while passing the onetimeencryption password, the
                  // encrypted JSON file, and the public key to the next screen
            mode="contained"
            style={styles.bigBtn}
            onPress={ () => {

              setInputTextValues('');
              setInputTagValues('');
              const data = { publicKey, oneTimeEncryptionPW, encryptedPrivateKey };
              hideModal();

              if(publicKey.startsWith('0x')){
                navigation.navigate('Account Display', { data });
              } else { 
                navigation.navigate('Account Display BTC', { data });
              }
            }
            }>
            <Text style={styles.buttonText}>
              Easy Sign
            </Text>
            
          </Button>

          <Button 
            mode="contained"
            style={styles.smallBtn}
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
    alignItems: 'center',
    justifyContent: 'center',
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

export default AccountPortal2;