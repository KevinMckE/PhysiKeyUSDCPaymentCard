import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';
import { getEthBalance, getAccountNfts, getImageUri } from '../components/HelperFunctions';
import CurrencyCard from '../components/CurrencyCard';

const Account = ({ navigation, route }) => {
  const [balance, setBalance] = useState('');
  const [nfts, setNfts] = useState([]);
  const [imageUris, setImageUris] = useState([]);
  const [loading, setLoading] = useState(true);
  const publicKey = '0xaF1F12460b8c0e42e248372389122c69c55a1f60'
  //const { publicKey } = route.params;
  const truncatedKey = `${publicKey.slice(0, 7)}...${publicKey.slice(-5)}`;
  const thirdWindowsWidth = Dimensions.get('window').width / 3;

 
   useEffect(() => {
     const fetchBalance = async () => {
       try {
         let balance = await getEthBalance(publicKey);
         if (balance === '0.') {
           balance = '0.0';
         }
         setBalance(balance);
       } catch (error) {
         //console.warn(error);
       }
     };
     fetchBalance();
   }, []);
 
  useEffect(() => {
    const fetchNfts = async () => {
      try {
        const nftList = await getAccountNfts(publicKey);
        setNfts(nftList);
      } catch (error) {
        //console.warn(error);
      }
    };
    fetchNfts();
  }, []);


  useEffect(() => {
    const fetchImageUris = async () => {
      if (nfts.length > 0) {
        const uris = await Promise.all(
          nfts.map(async (item) => {
            const uri = await getImageUri(item);
            return uri;
          })
        );
        setImageUris(uris);
        setLoading(false);
      }
    };
    fetchImageUris();
  }, [nfts]);

  const openDetailsScreen = (nft, imageUri) => {
    navigation.navigate('NftDetails', { publicKey, selectedNFT: nft, imageUri });
  };

  const renderNFTCard = ({ item, index }) => (
    <TouchableOpacity onPress={() => openDetailsScreen(item, imageUris[index])}>
      <Card mode='contained' >
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: thirdWindowsWidth, height: thirdWindowsWidth }} />
        ) : (
          <Card.Cover source={{ uri: imageUris[index] }} style={{ width: thirdWindowsWidth, height: thirdWindowsWidth }} />
        )}
      </Card>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.balanceContainer}>
        <CurrencyCard
          title="Ethereum Balance"
          pub={truncatedKey}
          subtitle={balance}
          imageSource={require('../assets/eth_logo.png')}
        />
      </View>
      <View style={styles.nftContainer}>
      <Text style={styles.headingText}>Your NFT Collection</Text>
      {!nfts || typeof nfts =='undefined' ? (
          <Text style={styles.errorText}>Oops! You do not have any NFTs in this wallet.</Text>
        ) : (
          <>
      <FlatList
          horizontal
          data={nfts}
          renderItem={renderNFTCard}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ gap: 15 }}
        />
        </>
        )}
      </View>
      <View style={styles.aboutContainer}>
      <Text style={styles.errorText} selectable>{publicKey}</Text>
        <Text style={styles.headingText}>About Us</Text>
        <Card style={styles.card}>
          <Text style={styles.paragraphText}>Anywhere Blockchain is building simple, safe, and more affordable key management tools for the future of finance, media, and governance. Our mobile application simplifies data ownership for users of Web 3 technology, using NFC chips to regenerate complex signing keys and passwords for the end user without storing them on remotely exploitable databases. This will have applications in the future of digital identity, social media, and blockchain-based computer transactions.</Text>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',

  },
  balanceContainer: {
    flex: 1,
  },
  nftContainer: {
    flex: 2,
    padding: 10
  },
  aboutContainer: {
    flext: 1,
  },
  headingText: {
    fontSize: 18,
    margin: 10,
    color: '#000000',
    fontWeight: 'bold',
  },
  paragraphText: {
    color: '#000000',
    fontSize: 18,
    margin: 10,
  },
  card: {
    margin: 10,
    backgroundColor: '#ffffff',
  },
  errorText: {
    margin: 10,
    height: 50,
  }
});

export default Account;