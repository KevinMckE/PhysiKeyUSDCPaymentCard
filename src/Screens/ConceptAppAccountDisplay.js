import React, { useState, useEffect } from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ImageBackground, Modal} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';
import { useRoute } from '@react-navigation/native';
import Config from 'react-native-config';
import Web3 from 'web3';
import CryptoJS from 'crypto-js';
import DatePicker from 'react-native-date-picker';

var receiverPublicKey = '';
let finalDataChain = ''; // append all inputValues to this variable
var tempDataChain = '';
var salt = 'BklcooclkncUhnaiianhUcnklcooclkB';
var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, hasher: CryptoJS.algo.SHA256, iterations: 1024 });
var web3 = new Web3(Web3.givenProvider);

var tempEncryptedPrivateKey;
var receiverPublicKey = '';

function ConceptAppAccountDisplay(props) {
  const {navigation} = props;
  const route = useRoute();
  const { data } = route.params;
  const { publicKey, oneTimeEncryptionPW, encryptedPrivateKey } = data;
  const [accountBalance, setAccountBalance] = React.useState();

  const [accountToSend, setAccountToSend] = React.useState();
  const setReceiverAccount = () => setAccountToSend(receiverPublicKey);

  const [amountToSend, setAmountToSend] = React.useState();

  const [modalVisible=false, setModalVisible] = React.useState();
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const [accountModalVisible=false, setAccountModalVisible] = React.useState();
  const showAccountModal = () => setAccountModalVisible(true);
  const hideAccountModal = () => setAccountModalVisible(false);

  const [accountNumber, setAccountNumber] = useState(new Date())


  const web3 = new Web3('https://api.tatum.io/v3/blockchain/node/ethereum-goerli/' + Config.TATUM_API_KEY);

  useEffect(() => {

    web3.eth.getBalance(publicKey, (err, bal) => {
      setAccountBalance(web3.utils.fromWei(bal.toString(), 'ether'));
    });

  }, []);

  async function readReceiverAccountNumber() {

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

              var decryptedAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
              receiverPublicKey = decryptedAccount.address;

              setReceiverAccount(receiverPublicKey);
              console.warn(receiverPublicKey);
              // reset all values containing sensitive data to null / baseline:
              decryptedAccount = {};
              privateKey = '';
              finalDataChain = ''; //clear finalDataChain
              tempDataChain = '';  

                      setInputTextValues('');
                      setInputTagValues('');

    } catch (ex) {
        //bypass
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
      let nfcRead = await String.fromCharCode(...tagPayload); // concats the string of the tagPayload into original string

      //console.warn(nfcRead); //print the information read from the tag

      return nfcRead;

    } catch (ex) {
        //bypass
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  }

  async function signTransaction() {

    // Sign the transaction with tag or with encrypted private key
    // this should check if the private key is null or not(meaning that 
    // the use either did sign with tag or easy sign)
    if(encryptedPrivateKey != ''){

    web3.eth.getTransactionCount(publicKey, (err, txCount) => {

        txObject = {
          "nonce": web3.utils.toHex(txCount),
          "from" : web3.utils.toHex(publicKey),
          "to": web3.utils.toHex(accountToSend),
          "value": web3.utils.toHex(web3.utils.toWei(amountToSend, 'ether')),
          "gasLimit": web3.utils.toHex(21000),
          "gasPrice" : web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
        }
    
        console.log(txObject);
    
        try{

          console.warn(encryptedPrivateKey);
          console.warn(oneTimeEncryptionPW);
          console.warn(CryptoJS.AES.decrypt(encryptedPrivateKey, oneTimeEncryptionPW).toString(CryptoJS.enc.Utf8));

          web3.eth.accounts.signTransaction(txObject, CryptoJS.AES.decrypt(encryptedPrivateKey, oneTimeEncryptionPW).toString(CryptoJS.enc.Utf8), (err, signedTransaction) => {
          
          console.log(signedTransaction)

          web3.eth.sendSignedTransaction(signedTransaction.rawTransaction, (err, txHash) => {
            console.warn('txHash: ', txHash);
          })
          
          });          
          
        } catch(error){
            console.log(error);
        } 
        
      })
      
    } else {

      tempEncryptedPrivateKey = await readNdef(); // why isn't this getting called, while the below console.warns are working correctly?
      console.warn('control flow test 1: ' + tempEncryptedPrivateKey);

      web3.eth.getTransactionCount(publicKey, (err, txCount) => {

        txObject = {
          "nonce": web3.utils.toHex(txCount),
          "from" : web3.utils.toHex(publicKey),
          "to": web3.utils.toHex(accountToSend),
          "value": web3.utils.toHex(web3.utils.toWei(amountToSend, 'ether')),
          "gasLimit": web3.utils.toHex(21000),
          "gasPrice" : web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
        }
    
        console.log(txObject);

        try{

          console.warn('control flow test');
          console.warn(tempEncryptedPrivateKey);
          console.warn(oneTimeEncryptionPW);
          console.warn(CryptoJS.AES.decrypt(tempEncryptedPrivateKey, oneTimeEncryptionPW).toString(CryptoJS.enc.Utf8));

          web3.eth.accounts.signTransaction(txObject, CryptoJS.AES.decrypt(tempEncryptedPrivateKey, oneTimeEncryptionPW).toString(CryptoJS.enc.Utf8), (err, signedTransaction) => {
          
          tempEncryptedPrivateKey = '';

          console.log(signedTransaction)

          web3.eth.sendSignedTransaction(signedTransaction.rawTransaction, (err, txHash) => {
            console.warn('txHash: ', txHash);
          })
          
          });
    
        } catch(error){
        console.log(error);
        }
    
        }
    
      )}
    
  }
  
  return (
      
    <View style={{ flex: 1, backgroundColor: '#F4F5F7' }} >

      <View style={styles.container}>
      
        <View style={styles.whiteBoxPublicKey}>
        <View style={styles.blackSquare}>
        <Image source={require('../assets/Logo.png')} style={styles.LogoWhiteSize}/>
        </View>
        <Text style={styles.publicKeyText}>Public Key</Text>
        <Text selectable style={styles.publicKeyText2}>{publicKey}</Text>
        
        </View>
        <View style={styles.blackBox}>
        <View style={styles.whiteSquare}>
        <Image source={require('../assets/MoneyInWalletImage.jpg')} style={styles.LogoWhiteSize}/>
        </View>
        <Text style={styles.amountText}>{accountBalance} ETH</Text>
        <Text style={styles.accountBalanceText}>Account Balance</Text>
    
        </View>
        
        </View> 
        <View style={styles.whiteBoxTransaction}>

        <Text style={styles.inputText}>Input Address : {accountToSend}</Text>
        <Button 
            mode="contained"
            style={styles.smallBtn}
            onPress={() => {
            showAccountModal();
            }}>
            <Text style={styles.buttonText}>
              Scan Tag To Input
            </Text>
        </Button>

        <TextInput

            style={styles.inputBox}
            placeholder="Input Address to Send To"
            autoComplete='off'
            autoCorrect={false}
            inputValue={accountToSend}
            onChangeText={setAccountToSend}
            autoCapitalize={false}
            returnKeyType={'done'}
            

            />
        <Text style={styles.inputText}>Input Amount:</Text>

        <TextInput
            style={styles.inputBox}
            placeholder="Input Amount to Send To Address"
            autoComplete='off'
            autoCorrect={false}
            inputValue={amountToSend}
            onChangeText={setAmountToSend}
            autoCapitalize={false}
            returnKeyType={'done'}
            keyboardType={'numeric'}
            />
        <Button 
          mode=  "contained" 
          style={[styles.sendMoneyButton]}
          onPress={() => {
              signTransaction();
              }}>
            <Text style={styles.sendMoneyButtonText}>
              Send Money
            </Text>
        </Button>

        <Modal  
        visible = {modalVisible}>
          <View 
            backgroundColor={'black'}
            style={styles.container}
            borderRadius={10}>
            
          <Button 
            mode="contained"
            style={styles.btn}
            onPress={hideModal}
            title = 'Send NFT'>
          </Button>

          <Button 
            mode="contained"
            style={styles.btn}
            onPress={hideModal}
            title = 'Go Back'>
          </Button>

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
            await readReceiverAccountNumber();

          }}>
            <Text style={styles.scanButtonText}>
              Scan Tag
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
  },
  bannerText: {
    fontSize: 20,
    textAlign: 'center',
    color: 'black',
    fontVariant: 'small-caps',
    fontWeight: 'bold',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    width: '100%',
  },
  backgroundImage: {
    flex: 1,
  },
  smallBtn: {
    width: 200,
    height: 40,
    marginLeft: 55,
    color: 'wblack',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#9F9D9D',
    backgroundColor: 'white',
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
    fontSize: 10,
    color: 'black',
    fontWeight: '500',
    fontVariant: 'small',
  },
  textInput: {
    padding: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    height: 200,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    flex: 1,
    alignSelf: 'stretch',
    width: undefined,
    height: undefined,
  },
  containerCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    margin: 10,
  },
  info: {
    flex: 1,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    marginBottom: 5,
  },
  attribute: {
    color: '#777',
    fontSize: 12,
  },
  container: {
    flex:0,
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
    width: 250,
    height: 200,
    alignItems:'center',
    justifyContent:'center',
    marginTop: 70,
    marginLeft: 0,
  },

  
  whiteBoxPublicKey: {
    width: 365,
    height: 140,
    marginBottom: 0,
    marginTop: 15,
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
    width: 365,
    height: 140,
    marginBottom: 0,
    marginTop: 25,
    backgroundColor: 'black',
    borderRadius: 10,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    shadowColor: "#989AA0",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.04,
    shadowRadius: 1.84,
    elevation: 5,
  },

  blackSquare: {
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

  whiteSquare: {
    width: 100,
    height: 100,
    marginBottom: 0,
    backgroundColor: 'white',
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
    fontSize: 15,
    position: 'absolute',
    top: 65,
    left: 140,
    textAlign:"left"
   
  },
  amountText:{
    fontSize: 36,
    fontWeight:'700',
    color: 'white',
    position: 'absolute',
    top: 32,
    left: 140,

  },

  accountBalanceText:{
    fontSize: 19,
    fontWeight:'400',
    color: '#D9D9D9',
    position: 'absolute',
    top: 72,
    left: 140,

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
    marginTop: -30,
    marginLeft: 240,
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

      whiteBoxTransaction: {
        width: 365,
        height: 365,
        marginBottom: 0,
        marginTop: 15,
        marginLeft: 25,
        backgroundColor: 'white',
        borderRadius: 5,
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

      sendMoneyText: {
        fontSize: 21,
        fontWeight:'500',
        color: '#5D6994',
        textAlign: 'left',
        marginLeft: 25,
        marginTop: 40,
    
    
      },

      inputText:{
        fontSize: 18,
        fontWeight:'500',
        color: 'black',
        textAlign: 'left',
        marginLeft: 7,
        marginTop: 5,
        marginBottom: 7,


      },

      inputBox: {
        width: 320,
        height: 30,
        borderColor: '#9F9D9D',
        borderRadius: 5,
        borderWidth: 2,
        backgroundColor: 'white',
        padding: 10,
        marginBottom: 20,
        fontSize: 16,
      },

      sendMoneyButton: {
        width: 320,
        height: 55,
        marginBottom: 5,
        marginTop: 5,
        borderRadius:15, 
        color: 'white',
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
      },

      sendMoneyButtonText: {                
        fontSize: 20,
        color: 'white',
        fontWeight:'500',
        fontVariant:'small',
      },

});

export default ConceptAppAccountDisplay;




// Buttons from original UI

{/* <Text style={styles.bannerText}>Public Key: </Text>
      <Text style={styles.bannerText} selectable>{publicKey}</Text>
      <Text style={styles.bannerText}>Account Balance: {accountBalance}</Text>

      <Text style={styles.bannerText}>Input Address:</Text>

      <TextInput style={styles.textInput}
            label="Input Address to Send To"
            autoComplete='off'
            autoCorrect={false}
            inputValue={accountToSend}
            onChangeText={setAccountToSend}
            autoCapitalize={false}
            backgroundColor={'grey'}
            color={'white'}
            returnKeyType={'done'}
          />

      <Text style={styles.bannerText}>Input Amount to Send:</Text>

      <TextInput style={styles.textInput}
            label="Input Amount to Send To Address"
            autoComplete='off'
            autoCorrect={false}
            inputValue={amountToSend}
            onChangeText={setAmountToSend}
            autoCapitalize={false}
            backgroundColor={'grey'}
            color={'white'}
            returnKeyType={'done'}
            keyboardType={'numeric'}
          />

      <View style={styles.wrapper}>
        <Button 
              mode="contained" 
              style={styles.bigBtn} 
              onPress={() => {
              signTransaction();
              }}>
              <Text style={styles.buttonText}>
                Sign/Send
              </Text> 
        </Button>

        <Button 
              mode="contained" 
              style={styles.bigBtn} 
              onPress={() => {
                web3.eth.getBalance(publicKey, (err, bal) => {
                setAccountBalance(web3.utils.fromWei(bal.toString(), 'ether'));
                });;
              }}>
              <Text style={styles.buttonText}>
              Refresh Balance
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
      </View> */}