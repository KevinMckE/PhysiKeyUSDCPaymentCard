import React, { useState, useEffect } from 'react';
import {
  SafeAreaView, StyleSheet, Text, View, ImageBackground, Modal} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import Moralis from "moralis";
import { EvmChain, EvmTransaction } from "@moralisweb3/common-evm-utils";
import { useRoute } from '@react-navigation/native';
import Config from 'react-native-config';

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
    const getBalance = async () => {
      try {
        await Moralis.start({
          apiKey: Config.MORALIS_API_KEY,
        });
      
        const address = publicKey;
      
        const chain = EvmChain.GOERLI;
      
        const response = await Moralis.EvmApi.balance.getNativeBalance({
          address,
          chain,
        });
      
        console.log(response.toJSON());
        const json = response.toJSON();
        setAccountBalance(parseInt(json.balance));
          
      } catch (error) {
          console.log(error);
      }
    };

    getBalance();

  }, []);

  const signTransaction = () => {

    // this should check if the private key is null or not(meaning that 
    // the use either did sign with tag or easy sign)

    const tx = new EvmTransaction({
      from: publicKey,
      to: accountToSend,
      value: amountToSend,
      chainId: 1,
    });

    const signedTx = tx.sign("<private key>");
    const txHash = tx.send(signedTx);
    
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