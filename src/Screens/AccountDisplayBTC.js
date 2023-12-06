import React, { useState, useEffect } from 'react';
import {
  Image, SafeAreaView, StyleSheet, Text, View, ImageBackground, Modal} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';
import { useRoute } from '@react-navigation/native';
import Config from 'react-native-config';
import CryptoJS from 'crypto-js';
import * as bitcoin from 'bitcoinjs-lib';
import axios from 'axios';
import { ec as EC } from 'elliptic';
import ecc from '@bitcoinerlab/secp256k1';
import { ECPairFactory } from 'ecpair';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const ECPair = ECPairFactory(ecc);
var tempEncryptedPrivateKey;
const ec = new EC('secp256k1');

function AccountDisplayBTC(props) {
  const {navigation} = props;
  const route = useRoute();
  const { data } = route.params;
  const { publicKey, oneTimeEncryptionPW, encryptedPrivateKey } = data;
  const [accountBalance, setAccountBalance] = React.useState();
  const [accountToSend, setAccountToSend] = React.useState();
  const [amountToSend, setAmountToSend] = React.useState();

  const [modalVisible=false, setModalVisible] = React.useState();
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const testnet = bitcoin.networks.testnet;
  var utxoArray = [];
  var rawTxDataArray = [];
  var pubKeyScriptArray = [];
  var txToBroadcast = '';

  useEffect(() => {

    refreshBalance();

    });

    async function refreshBalance() {

      try {
        const response = await axios.get(`https://api.tatum.io/v3/bitcoin/address/balance/${publicKey}`, {
          headers: {
            'x-api-key': Config.TATUM_API_KEY
          }
        });
    
        console.log(response.data);
        setAccountBalance(response.data.incoming - response.data.outgoing);
      } catch (error) {
        console.error('Error:', error.message);
      }
  
    }

    // This API Call will gather all of the UTXOs from an address, check whether it is more than the value of the totalValue param
    async function getUTXOs(relayFee) {

      var totalValue = parseFloat(amountToSend) + parseFloat(relayFee);

      try{
      const query = new URLSearchParams({
        chain: 'bitcoin-testnet',
        address: publicKey.toString(),
        totalValue: totalValue.toString(),
      }).toString();
    
      const response = await axios.get(`https://api.tatum.io/v3/data/utxos?${query}`,{
          headers: {
            'x-api-key': Config.TATUM_API_KEY
          }
        });
    
      utxoArray = await response.data;
      console.log(utxoArray);
      return utxoArray;
      } catch (error) {
        console.error('Error:', error.message);
      }
    }

    async function getRawTxData(txHash) {

      try{
      const hash = txHash;
    
      const response = await axios.get(`https://api.tatum.io/v3/bitcoin/transaction/${hash}`,{
          headers: {
            'x-api-key': Config.TATUM_API_KEY
          }
        });
    
      const data = response.data;
      console.log("Raw Tx Hex: " + data);
      return data;
      } catch (error) {
        console.error('Error:', error.message);
      }
    }

    async function getPubKeyScript(txHash, txIndex) {

      try{
        const hash = txHash;
        const index = txIndex;
        const response = await axios.get(`https://api.tatum.io/v3/bitcoin/utxo/${hash}/${index}`,{
          headers: {
            'x-api-key': Config.TATUM_API_KEY
          }
        });
    
      const data = response.data;
      console.log("PubKey Script Data: " + data);
      return data;
      } catch (error) {
        console.error('Error:', error.message);
      }
    }

    async function broadcastTransaction(rawTxData) {

      try{
        const response = await axios.post(`https://api.tatum.io/v3/bitcoin/broadcast`,
          {
          txData: rawTxData
          },
          {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': Config.TATUM_API_KEY
          },
          
          }
        );
    
      const data = response.data;
      console.log("Tx Hash: ");
      console.log(data);
      return data;
      } catch (error) {
        console.error(error.response.data);
      }
    }

    async function getRelayFee(fromAddress, accountToSend, amountToSend) {
      try{
        const response = await axios.post(`https://api.tatum.io/v3/blockchain/estimate`,
          {
            chain: 'BTC',
            type: 'TRANSFER',
            fromAddress: [
              fromAddress,
            ], 
            to: [
              {
                address: accountToSend,
                value: parseFloat(amountToSend)
              }
            ]
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': Config.TATUM_API_KEY
            }
          });
    
      const data = response.data;
      console.log("Relay Fee: ")
      console.log(data);
      return data.slow;
      } catch (error) {
        console.error(error.response);
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

      relayFee = await getRelayFee(publicKey, accountToSend, amountToSend);
      utxoArray = await getUTXOs(relayFee);

      //get UTXO hex's for get pubkeyscripts API and use for non-witness inputs
      for (let i = 0; i < utxoArray.length; i++) {
        var rawTxData = await getRawTxData(utxoArray[i].txHash);
        rawTxDataArray.push(rawTxData);
      }

      //get pubkeyscripts from segwit txs if inputs contains the correct SegWit Flags in the hex above
      // THIS MAY ALWAYS BE THE SAME PUBKEYSCRIPT FOR THE SAME ADDRESS??
      // MAY NOT NEED TO BE AN ARRAY IF IT IS THE SAME FOR EACH TX/ADDRESS
      for (let i = 0; i < utxoArray.length; i++) {
        // if rawTxDataArray[i] contains the segwit flag then get the pubkeyscript and maybe pair them in a transaction dictionary?
        var pubKeyScript = await getPubKeyScript(utxoArray[i].txHash, utxoArray[i].index);
        pubKeyScriptArray.push(pubKeyScript);
        // else if it doesn't contain this then pair the hash with the hex in the transaction dictionary...
      }

      console.log("UTXO Array ");
      console.log(utxoArray);
      console.log("Raw Tx Data Array: ");
      console.log(rawTxDataArray);
      console.log("PubKeyScript Array: ");
      console.log(pubKeyScriptArray);

      // Actual Transaction Details:

      var tempKeyPair = ECPair.fromPrivateKey(Buffer.from(CryptoJS.AES.decrypt(encryptedPrivateKey, oneTimeEncryptionPW).toString(CryptoJS.enc.Utf8), 'hex'));
      //var tempToKeyPair = ECPair.fromPublicKey(Buffer.from(accountToSend.toString(CryptoJS.enc.Utf8), 'hex'));
      //tempKeyPair.getPublic('hex');
      console.log("temp keypair: ");
      console.log(tempKeyPair);
      const txObject = new bitcoin.Psbt({network: testnet});
      var utxoTxTotal = 0; // Need to add up UTXOs for output equation

      const validator = (pubkey, msghash, signature) => {
        return tempKeyPair.verify(msghash, signature);
      };

      try{

        for (let i = 0; i < utxoArray.length; i++) {
          console.log("TxHash: " + utxoArray[i].txHash + " Index: " + utxoArray[i].index + " Witness Script: " + rawTxDataArray[i].witnessHash);
              txObject.addInput({
                hash: utxoArray[i].txHash,
                index: utxoArray[i].index,
                witnessUtxo: {
                  script: Buffer.from(pubKeyScriptArray[i].script, 'hex',),
                  value: pubKeyScriptArray[i].value,
                },
              });

              utxoTxTotal += utxoArray[i].value; //add all UTXO values together
        }

        // insert if statement that checks what kind of address the account to send is, if it's 
        // an m, this is legacy, if it's a 2 then it's regular segwit, else it's native segwit

            var changeAddressP2wpkh = bitcoin.payments.p2wpkh({pubkey: tempKeyPair.publicKey, network: testnet});
            //var toAddressP2wpkh = bitcoin.payments.p2wpkh({pubkey: tempToKeyPair.publicKey, network: testnet});

            //console.log(toAddressP2wpkh.address);
            console.log(changeAddressP2wpkh.address);

            txObject.addOutput({
              address: accountToSend,
              value: parseInt(parseFloat(amountToSend) * 100000000)
            });

            console.log("UTXO total: ");
            console.log(utxoTxTotal);

            console.log("Amount To Send: ");
            console.log(parseFloat(amountToSend));

            console.log('Relay Fee');
            console.log(relayFee);

            txObject.addOutput({
              address: changeAddressP2wpkh.address,
              // this needs to be the UTXO values not the account balance:
              value: parseInt((parseFloat(utxoTxTotal) - parseFloat(amountToSend) - parseFloat(relayFee)) * 100000000)
            });
            txObject.signAllInputs(tempKeyPair);
            txObject.validateSignaturesOfAllInputs(validator);
            txObject.finalizeAllInputs();
            txToBroadcast = txObject.extractTransaction().toHex();
            console.log(txToBroadcast);

            console.log(txObject.txOutputs);

      } catch (error) {
        console.log(error.message);

    } 
    }
      else {

      relayFee = await getRelayFee(publicKey, accountToSend, amountToSend);
      utxoArray = await getUTXOs(relayFee);

      //get UTXO hex's for get pubkeyscripts API and use for non-witness inputs
      for (let i = 0; i < utxoArray.length; i++) {
        var rawTxData = await getRawTxData(utxoArray[i].txHash);
        rawTxDataArray.push(rawTxData);
      }

      //get pubkeyscripts from segwit txs if inputs contains the correct SegWit Flags in the hex above
      // THIS MAY ALWAYS BE THE SAME PUBKEYSCRIPT FOR THE SAME ADDRESS??
      // MAY NOT NEED TO BE AN ARRAY IF IT IS THE SAME FOR EACH TX/ADDRESS
      for (let i = 0; i < utxoArray.length; i++) {
        // if rawTxDataArray[i] contains the segwit flag then get the pubkeyscript and maybe pair them in a transaction dictionary?
        var pubKeyScript = await getPubKeyScript(utxoArray[i].txHash, utxoArray[i].index);
        pubKeyScriptArray.push(pubKeyScript);
        // else if it doesn't contain this then pair the hash with the hex in the transaction dictionary...
      }

      console.log("UTXO Array ");
      console.log(utxoArray);
      console.log("Raw Tx Data Array: ");
      console.log(rawTxDataArray);
      console.log("PubKeyScript Array: ");
      console.log(pubKeyScriptArray);

      // Actual Transaction Details:
      tempEncryptedPrivateKey = await readNdef();
      var tempKeyPair = ECPair.fromPrivateKey(Buffer.from(CryptoJS.AES.decrypt(tempEncryptedPrivateKey, oneTimeEncryptionPW).toString(CryptoJS.enc.Utf8), 'hex'));
      //var tempToKeyPair = ECPair.fromPublicKey(Buffer.from(accountToSend.toString(CryptoJS.enc.Utf8), 'hex'));
      //tempKeyPair.getPublic('hex');
      console.log("temp keypair: ");
      console.log(tempKeyPair);
      const txObject = new bitcoin.Psbt({network: testnet});
      var utxoTxTotal = 0; // Need to add up UTXOs for output equation

      const validator = (pubkey, msghash, signature) => {
        return tempKeyPair.verify(msghash, signature);
      };

      try{

        for (let i = 0; i < utxoArray.length; i++) {
          console.log("TxHash: " + utxoArray[i].txHash + " Index: " + utxoArray[i].index + " Witness Script: " + rawTxDataArray[i].witnessHash);
              txObject.addInput({
                hash: utxoArray[i].txHash,
                index: utxoArray[i].index,
                witnessUtxo: {
                  script: Buffer.from(pubKeyScriptArray[i].script, 'hex',),
                  value: pubKeyScriptArray[i].value,
                },
              });

              utxoTxTotal += utxoArray[i].value; //add all UTXO values together
        }

        // insert if statement that checks what kind of address the account to send is, if it's 
        // an m, this is legacy, if it's a 2 then it's regular segwit, else it's native segwit

            var changeAddressP2wpkh = bitcoin.payments.p2wpkh({pubkey: tempKeyPair.publicKey, network: testnet});
            //var toAddressP2wpkh = bitcoin.payments.p2wpkh({pubkey: tempToKeyPair.publicKey, network: testnet});

            //console.log(toAddressP2wpkh.address);
            console.log(changeAddressP2wpkh.address);

            txObject.addOutput({
              address: accountToSend,
              value: parseInt(parseFloat(amountToSend) * 100000000)
            });

            console.log("UTXO total: ");
            console.log(utxoTxTotal);

            console.log("Amount To Send: ");
            console.log(parseFloat(amountToSend));

            console.log('Relay Fee');
            console.log(relayFee);

            txObject.addOutput({
              address: changeAddressP2wpkh.address,
              // this needs to be the UTXO values not the account balance:
              value: parseInt((parseFloat(utxoTxTotal) - parseFloat(amountToSend) - parseFloat(relayFee)) * 100000000)
            });
            txObject.signAllInputs(tempKeyPair);
            txObject.validateSignaturesOfAllInputs(validator);
            txObject.finalizeAllInputs();
            txToBroadcast = txObject.extractTransaction().toHex();

            tempEncryptedPrivateKey = '';
            tempKeyPair = {};
            console.log(txToBroadcast);

            console.log(txObject.txOutputs);
  
      }catch (error) {
      console.log(error.message);
      }
      
    }
  }
    
      
      
      // txObject.addOutput(Buffer.from(accountToSend, 'hex'), amountToSend); //Address to send and amount to spend
      // console.log(txObject.outs);

      // const privateKey = CryptoJS.AES.decrypt(encryptedPrivateKey, oneTimeEncryptionPW).toString(CryptoJS.enc.Utf8);
      // for (let i = 0; i < utxoArray.length; i++) {
      //   await txObject.signInput(i, privateKey);
      // }
        
      //   // print transaction if it worked
      //   console.log(txObject.build().toHex());

      //   //broadcast transaction:
  
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
        <Text style={styles.amountText}>{accountBalance} BTC</Text>
        <Text style={styles.accountBalanceText}>Account Balance</Text>
    
        </View>
        
        </View> 
        <Text style={styles.sendMoneyText}>Manage Transaction</Text>
        <View style={styles.whiteBoxTransaction}>

        <Text style={styles.inputText}>Input Address :</Text>

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

export default AccountDisplayBTC;


// Buttons in original UI for reference

{/* <Text style={styles.bannerText}>Public Key: </Text>
      <Text style={styles.bannerText} selectable>{publicKey}</Text>
      <Text style={styles.bannerText}>Account Balance: {accountBalance}</Text>

      <Text style={styles.bannerText}>Input Native SegWit Address(Must Start With TB1):</Text>

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
                broadcastTransaction(txToBroadcast);
              }}>
              <Text style={styles.buttonText}>
                Broadcast Tx
              </Text>  
        </Button>

        <Button 
              mode="contained" 
              style={styles.smallBtn} 
              onPress={() => {
                refreshBalance();
              }}>
              <Text style={styles.buttonText}>
                Get Balance
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





// gets a JSON with all transactions of an address, needs additional parsing for individual tx data

    // async function getTransactions(){

    //   try {
    //       const query = new URLSearchParams({pageSize: 10}).toString();
        
    //       const response = await fetch(`https://api.tatum.io/v3/bitcoin/transaction/address/${publicKey}?${query}&type=testnet`,
    //         {
    //           method: 'GET',
    //           headers: {
    //             'x-api-key': Config.TATUM_API_KEY
    //           }
    //         }
    //       );
        
    //       const data = await response.text();
    //       const formattedData = JSON.stringify(JSON.parse(data), null, 2);
    //       console.log(formattedData);
    //   } catch (error) {
    //     console.error('Error:', error.message);
    //   }
        
    // }