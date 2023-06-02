import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
  Image,
} from 'react-native';
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import axios from 'axios';

function AccountDisplay() {
  const [nfts, setNFTs] = useState();
  const walletAddress = '0x2119806e3368a7AcB28E79C7CAf67a586E6CF2a3';

  const getNFTs = async () => {
    try {
        const response = await axios.get('http://10.0.0.44:5002/get_user_nfts?address=0x2119806e3368a7AcB28E79C7CAf67a586E6CF2a3');
        setNFTs(response.data.result);
        console.log(response.data.result);
    } catch (error) {
        console.log(error);
    }
  };

  const NFTCard = ({ nft }) => {
    return (
      <View style={styles.card}>
        <Image source={{ uri: nft.normalized_metadata.image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.title}>{nft.normalized_metadata.name}</Text>
          <Text style={styles.description}>{nft.normalized_metadata.description}</Text>
          {nft.normalized_metadata.attributes.map((attr, index) => (
            <Text style={styles.attribute} key={index}>
              {attr.value}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  const renderedNFts = nfts && nfts.map((nft, index) => <NFTCard key={index} nft={nft} />);

  return (
    <SafeAreaView style={[{ flex: 1 }]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={[{ flex: 1 }]}
      >
        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={getNFTs}>
            <Text style={styles.buttonText}>GET NFTs</Text>
          </TouchableOpacity>
          {renderedNFts}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
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



//possible code to use for multiple chain config:

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