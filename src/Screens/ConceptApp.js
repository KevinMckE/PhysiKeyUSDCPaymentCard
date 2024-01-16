import React, { useState, useEffect } from 'react';
import {Image, Alert, View, Text, StyleSheet, TouchableOpacity, ImageBackground, Modal} from 'react-native';
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
import argon2 from 'react-native-argon2';
import Swiper from 'react-native-swiper';
import Config from 'react-native-config';
import DatePicker from 'react-native-date-picker';

var publicKey = '';
var encryptedPrivateKey = '';
var oneTimeEncryptionPW = '';
const ec = new EC('secp256k1');
let finalDataChain = ''; // append all inputValues to this variable
var tempDataChain = '';
var salt = 'BklcooclkncUhnaiianhUcnklcooclkB';
var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, hasher: CryptoJS.algo.SHA256, iterations: 1024 });
var web3 = new Web3(Web3.givenProvider);
const testnet = bitcoin.networks.testnet;


function ConceptApp(props) {
  const {navigation} = props;
  
  const [inputTextValue='', setInputTextValues] = React.useState();

  const [accountNumber, setAccountNumber] = useState(new Date())

  const [modalVisible=true, setModalVisible] = React.useState();
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const [accountModalVisible=false, setAccountModalVisible] = React.useState();
  const showAccountModal = () => setAccountModalVisible(true);
  const hideAccountModal = () => setAccountModalVisible(false);

  const [errorModal=false, setErrorModal] = React.useState();
  const showErrorModal = () => setErrorModal(true);
  const hideErrorModal = () => setErrorModal(false);

  const [keyStatusModal=false, setKeyStatusModal] = React.useState();
  const showKeyStatusModal = () => setKeyStatusModal(true);
  const hideKeyStatusModal = () => setKeyStatusModal(false);

  const [nextScreenModal=false, setNextScreenModal] = React.useState();
  const showNextScreenModal = () => setNextScreenModal(true);
  const hideNextScreenModal = () => setNextScreenModal(false);

  const [inputTagValue='', setInputTagValues] = React.useState();

  const web3 = new Web3('https://api.tatum.io/v3/blockchain/node/ethereum-goerli/' + Config.TATUM_API_KEY);

  useEffect(() => {

    showModal();

  }, []);

  async function readSerial() {

    try{
      await NfcManager.requestTechnology(NfcTech.NfcA);
      const tag = await NfcManager.getTag();
      console.warn(tag.id);
      console.warn(tag);
      
      tempDataChain += tag.id;

      finalDataChain += kdf.compute(tempDataChain, salt).toString();
      console.warn(finalDataChain);
      tempDataChain = finalDataChain;

              const innerHash = web3.utils.keccak256(finalDataChain);
              var privateKey = web3.utils.keccak256(innerHash + finalDataChain);

              oneTimeEncryptionPW = web3.utils.randomHex(32);
              encryptedPrivateKey = CryptoJS.AES.encrypt(privateKey, oneTimeEncryptionPW).toString();;
              var decryptedAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
              publicKey = decryptedAccount.address;

              setInputTagValues(encryptedPrivateKey);
              console.warn(encryptedPrivateKey);
              console.warn(oneTimeEncryptionPW);
              console.warn(publicKey);
              

              // reset all values containing sensitive data to null / baseline:
              decryptedAccount = {};
              privateKey = '';
              finalDataChain = ''; //clear finalDataChain
              tempDataChain = '';  

                      setInputTextValues('');
                      setInputTagValues('');
                      const data = { publicKey, oneTimeEncryptionPW, encryptedPrivateKey };
                      navigation.navigate('Concept App Account Display', { data });

    } catch (ex) {
        //bypass
    } finally {
      NfcManager.cancelTechnologyRequest();
    }

  }

  async function readSerialWithAccountNumber() {

    try{
      await NfcManager.requestTechnology(NfcTech.NfcA);
      const tag = await NfcManager.getTag();
      const account = accountNumber.toDateString();
      console.warn(account);
      console.warn(tag.id);
      tempDataChain += tag.id;
      tempDataChain += account;

      finalDataChain += kdf.compute(tempDataChain, salt).toString();
      console.warn(finalDataChain);
      tempDataChain = finalDataChain;

              const innerHash = web3.utils.keccak256(finalDataChain);
              var privateKey = web3.utils.keccak256(innerHash + finalDataChain);

              oneTimeEncryptionPW = web3.utils.randomHex(32);
              encryptedPrivateKey = CryptoJS.AES.encrypt(privateKey, oneTimeEncryptionPW).toString();;
              var decryptedAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
              publicKey = decryptedAccount.address;

              setInputTagValues(encryptedPrivateKey);
              console.warn(encryptedPrivateKey);
              console.warn(oneTimeEncryptionPW);
              console.warn(publicKey);
              

              // reset all values containing sensitive data to null / baseline:
              decryptedAccount = {};
              privateKey = '';
              finalDataChain = ''; //clear finalDataChain
              tempDataChain = '';  

                      setInputTextValues('');
                      setInputTagValues('');
                      const data = { publicKey, oneTimeEncryptionPW, encryptedPrivateKey };
                      navigation.navigate('Concept App Account Display', { data });

    } catch (ex) {
        //bypass
    } finally {
      NfcManager.cancelTechnologyRequest();
    }

  }

  return (
    
    <View style={styles.wrapper}>

      <Text style={styles.bannerText}>

      Touch Tag To Top Of The Phone To Login
        
      </Text>
        <View style={[styles.textInput]}>

          <Image
            source={require('../assets/TutorialArt3.png')}
            style={styles.backgroundImage}>    
          </Image>

        </View>

        <View style={styles.bottom}>

        <Button 
          mode="contained" 
          style={styles.bigBtn} 
          onPress={() => {
              finalDataChain = '';
              tempDataChain = '';
              publicKey = '';
              encryptedPrivateKey = '';
              oneTimeEncryptionPW = '';
              showModal();
            }
          }>
            <Text style={styles.buttonText}>
              Scan Again
            </Text>
          </Button>

          <Button 
          mode="contained" 
          style={styles.bigBtn} 
          onPress={() => {
              finalDataChain = '';
              tempDataChain = '';
              publicKey = '';
              encryptedPrivateKey = '';
              oneTimeEncryptionPW = '';
              showAccountModal();
            }
          }>
            <Text style={styles.buttonText}>
              Alternative Access
            </Text>
          </Button>

      <Modal  
        visible = {modalVisible}>
          <View 
            style={styles.wrapper}
            borderRadius={20}>
          <Text style={styles.bannerText} selectable>Touch Here {'\n'} {'\n'}</Text>
          
          <Button 
          mode="contained" 
          style={[styles.scanBtn]}
          onPress={ async () => {
            hideModal();
            await readSerial();

          }}>
            <Text style={styles.scanButtonText}>
              Scan Tag
            </Text>
          </Button>

          <Image
            source={require('../assets/TutorialArt3.png')}
            >    
          </Image>

        </View>
      </Modal>

      <Modal  
        visible = {accountModalVisible}>
          <View 
            style={styles.wrapper}
            borderRadius={20}>
          <Text style={styles.bannerText} selectable>Touch Here {'\n'} {'\n'}</Text>

          <Text style={styles.bannerText} selectable> Each Date Creates A Unique Account With Your Tag</Text>
          <Text selectable> Date: {accountNumber.toDateString()} </Text>

          <DatePicker date={accountNumber} minimumDate={new Date("1600-01-01")} onDateChange={setAccountNumber} mode={"date"} textColor='#000000'/>

          <Button 
          mode="contained" 
          style={[styles.scanBtn]}
          onPress={ async () => {
            hideAccountModal();
            await readSerialWithAccountNumber();

          }}>
            <Text style={styles.scanButtonText}>
              Scan Tag
            </Text>
          </Button>

        </View>
      </Modal>

      <Modal  
          visible = {keyStatusModal}>
            <View 
              style={styles.wrapper}
              borderRadius={10}>
            <Text style={styles.bannerText} selectable>Creating Keys...</Text>
            
          </View>
      </Modal>

      <Modal  
          visible = {nextScreenModal}>
            <View 
              style={styles.wrapper}
              borderRadius={10}>
            <Text style={styles.bannerText} selectable>Creating Keys...</Text>

            <Button 
              mode="contained" 
              style={[styles.scanBtn]}
              onPress={ async () => {

                setInputTextValues('');
                setInputTagValues('');
                const data = { publicKey, oneTimeEncryptionPW, encryptedPrivateKey };
                hideNextScreenModal();
                navigation.navigate('Concept App Account Display', { data });
              
              }}>
            <Text style={styles.scanButtonText}>
              Account Display
            </Text>
          </Button>
            
          </View>
      </Modal>

      <Modal  
          visible = {errorModal}>
            <View 
              style={styles.wrapper}
              borderRadius={10}>
            <Text style={styles.bannerText} selectable>Access Error {'\n'} {'\n'} Start Over And Try Again</Text>

            <Button 
            mode="contained"
            style={styles.bigBtn}
            onPress={() => {
            // reset all inputValues
            finalDataChain = '';
            tempDataChain = '';
            hideErrorModal();
            }}>
            <Text style={styles.easySignButtonText}>
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
    
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  textInput: {
    paddingHorizontal: 20,
    alignItems: 'center',
    padding: 2,
    marginBottom: 5,
  },
  bannerText: {
    fontSize: 30,
    textAlign: 'center',
    color: 'black',
    fontVariant: 'small-caps',
    padding: 75,
  },
  bottom: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  scanBtn: {
    width: 300,
    height: 50,
    marginBottom: 100,
    borderRadius:15, 
    borderColor:'gray',
    color: 'black',
    borderWidth: 1,
    color: 'white',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinBtn: {
    width: 200,
    height: 50,
    marginBottom: 15,
    borderRadius:15, 
    borderColor:'gray',
    color: 'white',
    borderWidth: 1,
    color: 'black',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigBtn: {
    width: 250,
    height: 70,
    marginBottom: 15,
    borderRadius:15, 
    borderColor:'gray',
    color: 'white',
    borderWidth: 1,
    color: 'black',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: 'black',
    fontVariant: 'small',
  },
  scanButtonText: {
    fontSize: 20,
    color: 'white',
    fontVariant: 'small',
  },
  modal: {
    flex: 1,
    backgroundColor: 'green',
    margin: 50,
    padding: 40,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textContainer: {
    justifyContent: 'center',
    alignItems: 'left',
    paddingLeft: 45,
    paddingTop: 85,
    paddingBottom: 35,
  },

  textContainer2: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft:35,
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 1,  
  },
  
  box: {
    width: 350,
    height: 450,
    backgroundColor: 'white',
    borderRadius: 15,
    paddingTop: 10,
    paddingBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.09,
    shadowRadius: 1.84,
    elevation: 5,
  },

  TotalInputCountText: {
    fontSize: 20,
    textAlign:'left',
    fontWeight:'500',
    color: 'black',
    marginLeft: 35,
    marginTop: 30,
  },
  PlainText : {
    fontSize: 15,
    textAlign:'center',
    fontWeight:'300',
    color: 'gray',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 5,
    marginRight:55,
  },
  InputPlainText: {
    fontSize: 20,
//textAlign:'left',
    fontWeight:'500',
    color: '#5D6994',
    marginLeft: 35,
    marginTop: 45,


  },

  circleRed: {
    width: 14, 
    height: 14,
    backgroundColor: '#F05858',
    borderRadius: 7, 
    position: 'absolute',
    top: 155,  
    left: 35,
  },

  circleGreen: {
    width: 14, 
    height: 14,
    backgroundColor: '#83C83C',
    borderRadius: 7, 
    position: 'absolute',
    top: 155,  
    left: 140,
  },

  circleBlue: {
    width: 14, 
    height: 14,
    backgroundColor: '#304170',
    borderRadius: 7, 
    position: 'absolute',
    top: 155,  
    left: 275,
  },

  graybox : {
    width: 300,
  height: 350,
  backgroundColor: '#F4F4F4',
  borderRadius: 15,
  paddingTop: 5,
  paddingBottom: 5,
  justifyContent: 'center',
  alignItems: 'center',
  },
  

  btn: {
    width: 260,
    height: 45,
    marginBottom: 10,
    borderRadius:15, 
    
    color: 'white',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonNext: {
    width: 350,
    height: 50,
    marginTop: 30,
    borderRadius:15, 
    
    color: 'white',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },

  


    input: {
        width: 300,
        height: 45,
        borderColor: '#DFDFDF',
        borderRadius:10,
        borderWidth: 1,
        padding: 10,
        marginBottom: 20,
      },
      
      homeText: {
         fontSize: 20,
        color: '#459BF8',
        fontWeight:'500',
        fontVariant:'small',
        
        marginLeft: 50,
        marginTop: 60,

      },
  
      btnsmall: {
        width: 70,
        height: 50,
        borderRadius:15, 
        color: 'white',
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
         position: 'absolute',
        top: 3,  
        left: 238,
        
      },

      arrowPosition: {
        position: 'absolute',
        top: 16,  
        left: 262,

      },

      backgroundImage: {
        width: 250,
        height: 200,
      },

      topImage: {

        width: 175,
        height: 175,
      },

      smallText:{
        fontSize: 17,
        color: '#BCBCBC',
        fontWeight:'250',
        fontVariant:'small',
        marginBottom: 60,
        marginTop: 10,
        paddingTop: 20,
      }
});

export default ConceptApp;