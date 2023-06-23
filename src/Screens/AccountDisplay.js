import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
  Button,
} from 'react-native';
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import { useRoute } from '@react-navigation/native';
import Config from 'react-native-config';

function AccountDisplay() {
  const route = useRoute();
  const { data } = route.params;
  const { publicKey, oneTimeEncryptionPW, encryptedPrivateKey } = data;
  const [accountBalance = 0.0, setAccountBalance] = React.useState();

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
        setAccountBalance(response.balance);
          
      } catch (error) {
          console.log(error);
      }
    };

    getBalance();

  }, []);
  
  return (
    <SafeAreaView style={[{ flex: 1 }]}>
      <Text style={styles.appTitle}>{publicKey}</Text>
      <Text>{accountBalance}</Text>

      <Modal  
        visible = {modalVisible}>
          <View 
            backgroundColor={'black'}
            style={styles.container}
            borderRadius={10}>
            

          <Button 
            mode="contained"
            style={styles.button}
            onPress={hideModal}
            title = 'Send NFT'>
          </Button>

          <Button 
            mode="contained"
            style={styles.button}
            onPress={hideModal}
            title = 'Go Back'>
          </Button>

          </View>
        </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
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
  button: {
    backgroundColor: '#0f8cff',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
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