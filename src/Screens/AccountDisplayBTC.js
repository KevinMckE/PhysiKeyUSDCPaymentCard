import React, { useState, useEffect } from 'react';
import {
  SafeAreaView, StyleSheet, Text, View, ImageBackground, Modal} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import Config from 'react-native-config';
import Web3 from 'web3';
import CryptoJS from 'crypto-js';
import fetch from 'node-fetch';

function AccountDisplay() {
  const route = useRoute();
  const { data } = route.params;
  const { publicKey, oneTimeEncryptionPW, encryptedPrivateKey } = data;
  const [accountBalance, setAccountBalance] = React.useState();
  const [accountToSend, setAccountToSend] = React.useState();
  const [amountToSend, setAmountToSend] = React.useState();

  const [modalVisible=false, setModalVisible] = React.useState();
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  useEffect(() => {

    async function getBalance() {
      const query = new URLSearchParams({
        chain: 'sepolia',
        addresses: publicKey
      }).toString();
      
      const resp = await fetch(
        `https://api.tatum.io/v3/data/balances?type=testnet${query}`,
        {
          method: 'GET',
          headers: {
          'x-api-key': Config.TATUM_API_KEY
          }
        }
      );
      
      const data = await resp.text();
      console.log(data);
    }
        
    getBalance();

  }, []);

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

      return nfcRead;

    } catch (ex) {
        //bypass
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  }

  const signTransaction = async () => {

    // this should check if the private key is null or not(meaning that 
    // the use either did sign with tag or easy sign)

    if(encryptedPrivateKey != null){

    try{
      const resp = await fetch(
        `https://api.tatum.io/v3/ethereum/transaction?type=testnet`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': Config.TATUM_API_KEY
          },
          body: JSON.stringify({
            to: accountToSend,
            amount: amountToSend,
            currency: 'ETH',
            fromPrivateKey: CryptoJS.AES.decrypt(encryptedPrivateKey, oneTimeEncryptionPW).toString()
          })
        }
      );
      const data = resp.JSON();

    } catch(error){
        console.log(error);
    }

    } else {
      
    try{

      encryptedPrivateKey = readNdef();

      const resp = await fetch(
        `https://api.tatum.io/v3/ethereum/transaction?type=testnet`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': Config.TATUM_API_KEY
          },
          body: JSON.stringify({
            to: accountToSend,
            amount: amountToSend,
            currency: 'ETH',
            fromPrivateKey: CryptoJS.AES.decrypt(encryptedPrivateKey, oneTimeEncryptionPW).toString()
          })
        }
      );

      encryptedPrivateKey = null;
      const data = resp.JSON();

    } catch(error){
    console.log(error);
    }

  console.log(data);

  }
}
  
  return (
    <ImageBackground source={require('../assets/AnyWareBackground.png')}
    style={styles.backgroundImage}>
    <SafeAreaView style={[{ flex: 1 }]}>
      <Text style={styles.bannerText}>{publicKey}</Text>
      <Text style={styles.bannerText}>{accountBalance}</Text>

      <Text style={styles.bannerText}>Input Address:</Text>

      <TextInput style={styles.textInput}
            label="Input Address to Send To"
            autoComplete='off'
            autoCorrect={false}
            inputValue={accountToSend}
            onChangeText={setAccountToSend}
            autoCapitalize={false}
            backgroundColor={'white'}
            color={'black'}
          />

      <Text style={styles.bannerText}>Input Amount to Send:</Text>

      <TextInput style={styles.textInput}
            label="Input Amount to Send To Address"
            autoComplete='off'
            autoCorrect={false}
            inputValue={amountToSend}
            onChangeText={setAmountToSend}
            autoCapitalize={false}
            backgroundColor={'white'}
            color={'black'}
          />

      <Button 
            mode="contained" 
            style={styles.btn} 
            onPress={() => {
            signTransaction();
            }}>
            Sign/Send
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

    </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bannerText: {
    fontSize: 30,
    textAlign: 'center',
    color: 'white',
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
  btn: {
    width: 250,
    marginBottom: 15,
    color: 'black',
    backgroundColor: 'white',
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
});

export default AccountDisplay;

// code to use for multiple chain config:

// const getNFTS = async () => {

//   await Moralis.start({
//     apiKey: "MORALIS_API_KEY",
//     // ...and any other configuration
//   });

//   const allNFTs = [];

//   const address = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";

//   const chains = [EvmChain.ETHEREUM, EvmChain.BSC, EvmChain.POLYGON];

//   for (const chain of chains) {
//     const response = await Moralis.EvmApi.nft.getWalletNFTs({
//       address,
//       chain,
//     });

//     allNFTs.push(response);
//   }

//   console.log(allNFTs);
//   return allNFTs;
// };