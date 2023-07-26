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
import wif from 'wif';

var publicKey = '';
var encryptedPrivateKey = '';
var oneTimeEncryptionPW = '';
const ec = new EC('secp256k1');
let finalDataChain = 'anywarewallet'; // append all inputValues to this variable

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
    <ImageBackground source={require('../assets/AnyWareBackground.png')}
    style={styles.backgroundImage}>
      <View style={styles.wrapper}>
          <View style={[styles.textInput]}>

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
          Access ETH Account
        </Button>

        <Button 
          mode="contained" 
          style={styles.btn} 
          onPress={ () => {

            if (inputCheck === finalDataChain){

              const firstHash = CryptoJS.SHA256(finalDataChain).toString();
              privateKey = CryptoJS.SHA256(firstHash + finalDataChain).toString();

              oneTimeEncryptionPW = web3.utils.randomHex(32);
              encryptedPrivateKey = CryptoJS.AES.encrypt(privateKey, oneTimeEncryptionPW).toString();
              var keyPairBTC = ec.keyFromPrivate(privateKey);
              publicKey = keyPairBTC.getPublic(true, 'hex');

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
          Access BTC Account
        </Button>

        <Button 
            mode="contained"
            style={styles.btn}
            onPress={() => {
            navigation.navigate('Home');
            }}>
            Start Over
        </Button>

      <Modal  
        visible = {modalVisible}>
          <View 
            backgroundColor={'black'}
            style={styles.wrapper}
            borderRadius={10}>
          <Text style={styles.bannerText} selectable>Compressed Pub Key:{publicKey}</Text>
          
          <Button // this button needs to write the encrypted private key to the tag
                  // then navigate to the account display while passing the
                  // onetimeencryption password and the public key into the next screen
            mode="contained"
            style={styles.btn}
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
            Sign With Tag
          </Button>

          <Button // this button needs to store the JSON for later use and navigate to 
                  // the account display while passing the onetimeencryption password, the
                  // encrypted JSON file, and the public key to the next screen
            mode="contained"
            style={styles.btn}
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
            Easy Sign (Less Secure)
          </Button>

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
    fontSize: 42,
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
});

export default AccountPortal2;