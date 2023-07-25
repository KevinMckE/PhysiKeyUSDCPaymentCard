import React, { useState, useEffect } from 'react';
import {
  SafeAreaView, StyleSheet, Text, View, ImageBackground, Modal} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';
import { useRoute } from '@react-navigation/native';
import Config from 'react-native-config';
import Bitcoin from 'react-native-bitcoinjs-lib';
import CryptoJS from 'crypto-js';

var tempEncryptedPrivateKey;

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

  useEffect(() => {

    // Get BTC balance

    });

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
      
    } else {

      tempEncryptedPrivateKey = await readNdef(); // why isn't this getting called, while the below console.warns are working correctly?
      console.warn('control flow test 1: ' + tempEncryptedPrivateKey);

    }
    
  }
  
  return (
    <ImageBackground source={require('../assets/AnyWareBackground.png')}
    style={styles.backgroundImage}>
    <SafeAreaView style={[{ flex: 1 }]}>
      <Text style={styles.bannerText} selectable>{publicKey}</Text>
      <Text style={styles.bannerText}>Account Balance: {accountBalance}</Text>

      <Text style={styles.bannerText}>Input Address:</Text>

      <TextInput style={styles.textInput}
            label="Input Address to Send To"
            autoComplete='off'
            autoCorrect={false}
            inputValue={accountToSend}
            onChangeText={setAccountToSend}
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
            backgroundColor={'white'}
            color={'black'}
          />
      <View style={styles.wrapper}>
        <Button 
              mode="contained" 
              style={styles.btn} 
              onPress={() => {
              signTransaction();
              }}>
              Sign/Send
        </Button>

        <Button 
              mode="contained" 
              style={styles.btn} 
              onPress={() => {
                
              }}>
              Refresh Balance
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
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
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

export default AccountDisplayBTC;