import React from 'react';
import {Alert, View, Text, StyleSheet, TouchableOpacity, ImageBackground, Modal} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';
import { useNavigation } from '@react-navigation/native';
import '../../shimeth.js';
import '../../shim.js';
import Web3 from 'web3';
import CryptoJS from 'crypto-js';
import { ec as EC } from 'elliptic';
import Bitcoin from 'react-native-bitcoinjs-lib';

var publicKey = '';
var encryptedPrivateKey = '';
var oneTimeEncryptionPW = '';
const ec = new EC('secp256k1');


function AccountPortal(props) {
  const {navigation} = props;

  let finalDataChain = 'anywarewallet'; // append all inputValues to this variable
  var web3 = new Web3(Web3.givenProvider);
  
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
        onPress={ () => {

          const innerHash = web3.utils.keccak256(finalDataChain);
          var privateKey = web3.utils.keccak256(innerHash + finalDataChain);

          oneTimeEncryptionPW = web3.utils.randomHex(32);
          encryptedPrivateKey = CryptoJS.AES.encrypt(privateKey, oneTimeEncryptionPW).toString();;
          var decryptedAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
          publicKey = decryptedAccount.address;

          setInputValues(encryptedPrivateKey);
          console.warn(encryptedPrivateKey);
          console.warn(oneTimeEncryptionPW);

          // reset all values containing sensitive data to null / baseline:
          decryptedAccount = {};
          privateKey = '';
          finalDataChain = 'anywarewallet'; //clear finalDataChain

          //console.warn(encryptedPrivateKey);

            // need encryption of private key, and need to pass encryption password to Account Display
            // insert modal to done screen to print private/public key pair;
            // when you do the comparison, only store the public key, so the private key isn't in memory until verifcation

          showModal();

          }
        }>
          Access ETH Account
        </Button>

        <Button 
        mode="contained" 
        style={styles.btn} 
        onPress={ () => {

          const firstHash = CryptoJS.SHA256(finalDataChain).toString();
          privateKey = CryptoJS.SHA256(firstHash + finalDataChain).toString();

          oneTimeEncryptionPW = web3.utils.randomHex(32);
          encryptedPrivateKey = CryptoJS.AES.encrypt(privateKey, oneTimeEncryptionPW).toString();;
          var decryptedAccount = ec.keyFromPrivate(privateKey);
          publicKey = decryptedAccount.getPublic('hex');

          setInputValues(encryptedPrivateKey);
          console.warn(encryptedPrivateKey);
          console.warn(oneTimeEncryptionPW);

          // reset all values containing sensitive data to null / baseline:
          decryptedAccount = {};
          privateKey = '';
          finalDataChain = 'anywarewallet'; //clear finalDataChain

          //console.warn(encryptedPrivateKey);

            // need encryption of private key, and need to pass encryption password to Account Display
            // insert modal to done screen to print private/public key pair;
            // when you do the comparison, only store the public key, so the private key isn't in memory until verifcation

          showModal();

          }
        }>
          Access BTC Account
        </Button>

      <Modal  
        visible = {modalVisible}>
          <View 
            backgroundColor={'black'}
            style={styles.wrapper}
            borderRadius={10}>
          <Text style={styles.bannerText} selectable>{publicKey}</Text>
          
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
              setInputValues('');

              const data = { publicKey, oneTimeEncryptionPW, encryptedPrivateKey };
              hideModal();
              navigation.navigate('Account Display', { data });
              
            }}>
            Sign With Tag
          </Button>

          <Button // this button needs to store the JSON for later use and navigate to 
                  // the account display while passing the onetimeencryption password, the
                  // encrypted JSON file, and the public key to the next screen
            mode="contained"
            style={styles.btn}
            onPress={ () => {

              setInputValues('');
              const data = { publicKey, oneTimeEncryptionPW, encryptedPrivateKey };
              hideModal();
              navigation.navigate('Account Display', { data });
            }
            }>
            Easy Sign (Less Secure)
          </Button>

          <Button 
            mode="contained"
            style={styles.btn}
            onPress={ () => {
              finalDataChain = 'anywarewallet';
              encryptedPrivateKey = '';
              oneTimeEncryptionPW = '';
              setInputValues('');
              hideModal();
            }
            }>
            Cancel & Clear Keys
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

export default AccountPortal;