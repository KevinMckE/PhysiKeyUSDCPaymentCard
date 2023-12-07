import React from 'react';
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

function AccountPortal2(props) {
  const {navigation} = props;

  const route = useRoute();
  let inputCheck = route.params.data;
  
  const [inputTextValue='', setInputTextValues] = React.useState();
  const [inputTagValue='', setInputTagValues] = React.useState();
  const [modalVisible=false, setModalVisible] = React.useState();
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const [keyStatusModal=false, setKeyStatusModal] = React.useState();
  const showKeyStatusModal = () => setKeyStatusModal(true);
  const hideKeyStatusModal = () => setKeyStatusModal(false);

  const [errorModal=false, setErrorModal] = React.useState();
  const showErrorModal = () => setErrorModal(true);
  const hideErrorModal = () => setErrorModal(false);

  const [textCount, setTextCount] = React.useState(0);
  const [numCount, setNumCount] = React.useState(0);
  const [tagCount, setTagCount] = React.useState(0);

  const [activeIndex, setActiveIndex] = React.useState(0);

  const swiperSlides = [
    [require('../assets/TutorialArt1.png'),'','Two Signing Options',''],
    [require('../assets/VerificationSuccessful.png'),'No Signing Tag? No problem. Click Easy Sign and Send Crypto On The Next Screen.','Easy Sign'],
    [require('../assets/TutorialArt2.png'),'For A More Secure Signing Session, Sign With Tag','Sign With Tag\n(Do Not Use Access Card)'],
    [require('../assets/TutorialArt3.png'),'Write your private key to the tag ','Sign With Tag\n(Do Not Use Access Card)'],
    [require('../assets/TutorialArt3.png'),'Tap your Tag On The Next Screen to sign the transaction','Sign With Tag\n(Do Not Use Access Card)'],

  ];

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

    } catch (ex) {
        //bypass
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.bannerText}>
        
        Access Combination: 
        {'\n'} {'\n'}
        Password Count: {textCount}
        {'\n'}
        {' '}Card Count: {tagCount}

        
      </Text>
        <View style={[styles.textInput]}>

          <TextInput
            style={styles.textInput}
            placeholder="Type Password or PIN"
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
              Password Input
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
              Read Card
            </Text>
          </Button>

        </View>

        <View style={styles.bottom}>
        
        <Button 
          mode="contained" 
          style={styles.bigBtn} 
          onPress={ async () => {

            if (inputCheck === finalDataChain){

              showKeyStatusModal();

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
              finalDataChain = ''; //clear finalDataChain
              tempDataChain = '';
              inputCheck = '';

              //console.warn(encryptedPrivateKey);

                // need encryption of private key, and need to pass encryption password to Account Display
                // insert modal to done screen to print private/public key pair;
                // when you do the comparison, only store the public key, so the private key isn't in memory until verifcation
              showModal();
              hideKeyStatusModal();
            }
            else{
              showErrorModal();
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
          onPress={ async () => {

            if (inputCheck === finalDataChain){

              showKeyStatusModal();

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
              finalDataChain = ''; //clear finalDataChain
              tempDataChain = '';
              inputCheck = '';

              //console.warn(encryptedPrivateKey);

                // need encryption of private key, and need to pass encryption password to Account Display
                // insert modal to done screen to print private/public key pair;
                // when you do the comparison, only store the public key, so the private key isn't in memory until verifcation

              showModal();
              hideKeyStatusModal();
            } else {
              showErrorModal();
            }

          }
        }>
          <Text style={styles.buttonText}>
            Access BTC
          </Text>
        </Button>

        <Button 
          mode="contained" 
          style={styles.bigBtn} 
          onPress={() => {
              finalDataChain = '';
              tempDataChain = '';
              setNumCount(0);
              setTagCount(0);
              setTextCount(0);
              navigation.navigate('Home');
            }
          }>
            <Text style={styles.buttonText}>
              Start Over
            </Text>
          </Button>
        

      <Modal  
        visible = {modalVisible}>
          <View 
            backgroundColor={'black'}
            style={styles.wrapper}
            >

          <Button 
            mode="contained" 
            style={styles.exportKeyButton} 
            onPress={() => {
              navigation.navigate('Raw Keys');
              hideModal();
            }}>
              <Text style={styles.exportKeyText}>
                  Export Keys
              </Text>
          </Button>

          <View style={styles.whiteBox}>
          <View style={styles.blackBox}>
          <Image source={require('../assets/Logo.png')} style={styles.LogoWhiteSize}/>
          </View>
          <Text style={styles.publicKeyText}>Public Key</Text>
          <Text style={styles.publicKeyText2} selectable>{publicKey}</Text>
          
          </View>

          <Swiper
                
                showsButtons={false}
                showsPagination={true}
                dotColor="#1234" // Customize dot color
                activeDotColor="#364A7F" // Customize active dot color
                loop ={false}
                index={activeIndex} 
              >
                
                {swiperSlides.map((image, index ) => (

                  <View key={index} style={styles.swiperAlignment}>  

                  <Text style={styles.titleTextBlack}>{image[2]}</Text>
                  <Text style={styles.bodyTextBlue}>{image[3]}</Text>
                  <Text style={styles.bodyTextGray}>{image[1]}</Text>
                  <Image source={image[0]} style={styles.imageAlignment} resizeMode='contain'/>

                  </View>
                  
                ))}

            </Swiper>
          
          <Button // this button needs to write the encrypted private key to the tag
                  // then navigate to the account display while passing the
                  // onetimeencryption password and the public key into the next screen
            mode="contained"
            style={styles.signWithTagButton}
            onPress={ async () => {
              // this needs to try to write the JSON file to the tag, if successful then navigate to account display
              // if not successful, hide modal, clear passwords, and display error message
              
              await writeNdef();
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
            <Text style={styles.signWithTagbuttonText}>
              Sign With Tag
            </Text>
            
          </Button>

          <Button // this button needs to store the JSON for later use and navigate to 
                  // the account display while passing the onetimeencryption password, the
                  // encrypted JSON file, and the public key to the next screen
            mode="contained"
            style={styles.easySignButton}
            onPress={ async () => {

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
            <Text style={styles.easySignButtonText}>
              Easy Sign
            </Text>
            
          </Button>

          <Button 
            mode="contained"
            style={styles.smallBtn}
            onPress={() => {
            // reset all inputValues
            finalDataChain = '';
            tempDataChain = '';
            navigation.navigate('Home');
            }}>
            <Text style={styles.easySignButtonText}>
              Start Over
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
          visible = {errorModal}>
            <View 
              style={styles.wrapper}
              borderRadius={10}>
            <Text style={styles.bannerText} selectable>Inputs Did Not Match</Text>

            <Button 
            mode="contained"
            style={styles.smallBtn}
            onPress={() => {
            // reset all inputValues
            finalDataChain = '';
            tempDataChain = '';
            navigation.navigate('Home');
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
    width: 300,
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
  modal: {
    flex: 1,
    backgroundColor: 'green',
    margin: 50,
    padding: 40,
    borderRadius: 10,
  },
  container: {
    flex:0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swiperAlignment: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer2: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft:35,
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 1,  
  },
  imageAlignment: {
    width: 150,
    height: 150,
    alignItems:'center',
    justifyContent:'center',
    marginTop: 0,
    marginLeft: 0,
  },
  whiteBox: {
    width: 365,
    height: 145,
    marginBottom: 0,
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 165,
    shadowColor: "#989AA0",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.04,
    shadowRadius: 1.84,
    elevation: 5,
  },

  blackBox: {
    width: 100,
    height: 100,
    marginBottom: 0,
    backgroundColor: 'black',
    borderRadius: 10,
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#989AA0",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.04,
    shadowRadius: 1.84,
    elevation: 5,
  },
  LogoWhiteSize:{
    width:90,
    height:90,
  },
publicKeyText: {
    fontSize: 24,
    fontWeight:'500',
    color: 'black',
    position: 'absolute',
    top: 30,
    left: 140,
  },
  publicKeyText2:{
    color:'#BABABA', 
    fontSize: 16,
    position: 'absolute',
    top: 65,
    left: 140,
    textAlign:"left"
  },
  ethereumText:{
    color:'#5D5D5D', 
    fontSize: 22,
    fontWeight: '700',
    alignSelf: 'center'
  },
  ethText:{
    color:'#767474', 
    marginTop: 5,
    marginBottom: 90,
    fontSize: 20,
    alignSelf: 'center'
  },
  signWithTagButton: {
    width: 350,
    height: 55,
    marginBottom: 5,
    marginTop: 20,
    borderRadius:15, 
    color: 'white',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  easySignButton: {
    width: 350,
    height: 55,
    marginBottom: 20,
    marginTop: 5,
    borderRadius:15, 
    borderColor:'gray',
    color: 'white',
    borderWidth: 1,
    backgroundColor: 'Black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportKeyButton: {
    width: 150,
    height: 45,
    borderRadius:12, 
    borderColor:'gray',
    color: 'white',
    borderWidth: 1,
    backgroundColor: 'Black',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    marginLeft: 200,
  },
  signWithTagbuttonText: {                
    fontSize: 20,
    color: 'white',
    fontWeight:'500',
    fontVariant:'small',
  },
  easySignButtonText: {
    fontSize: 20,
    color:'gray',
    fontWeight:'500',
    fontVariant:'small',
  },
      arrowPosition: {
        position: 'absolute',
        top: 60,  
        left: 15,

      },
      homeText: {
        color:'#009DFF', 
        fontSize: 20,
        paddingLeft:40,
        marginTop: 60,
      },
      exportKeyText: {
        fontSize: 19,
        color:'#9D9A9A',
        fontWeight:'400',
        fontVariant:'small',
        marginBottom: 15,
        marginLeft: 17,

      },
      titleTextBlack: {                        
        backgroundColor: '#FFF',
        fontSize: 26,
        textAlign:'center',
        paddingTop:10,
        fontWeight:'bold',
        marginTop: 20,
      },
      bodyTextGray: {                       
        backgroundColor: '#FFF',
        fontSize: 16,
        paddingTop:20,
        paddingBottom:20,
        textAlign:'center',
        fontWeight:'400',
        color: '#8D8A8A',
        paddingLeft:20,
        paddingRight: 20,
      },
      bodyTextBlue: {                     
        backgroundColor: '#FFF',
        fontSize: 26,
        textAlign:'center',
        paddingTop:0,
        fontWeight:'bold',
        color: '#364A7F',
      },

});

export default AccountPortal2;