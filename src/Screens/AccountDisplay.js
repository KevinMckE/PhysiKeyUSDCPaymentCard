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

function AccountDisplay() {
  const [nfts, setNFTs] = useState();

  const getNFTdata = async () => {
    try {
        const response = getNFTS();
        setNFTs(response.data.result);
    } catch (error) {
        console.log(error);
    }
  };

const getNFTS = async () => {

    await Moralis.start({
      apiKey: "MORALIS_API_KEY",
      // ...and any other configuration
    });
  
    const allNFTs = [];
  
    const address = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";
  
    const chains = [EvmChain.ETHEREUM, EvmChain.BSC, EvmChain.POLYGON];
  
    for (const chain of chains) {
      const response = await Moralis.EvmApi.nft.getWalletNFTs({
        address,
        chain,
      });
  
      allNFTs.push(response);
    }
  
    console.log(allNFTs);
    return allNFTs;
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
    <SafeAreaView style={[backgroundStyle, { flex: 1 }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={[backgroundStyle, { flex: 1 }]}
      >
        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={getNFTdata}>
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