import React, { useState, useEffect } from 'react';
import { View, ScrollView, Dimensions, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Text, Card } from 'react-native-paper';
import { getOptimismBalance } from '../functions/getOptimismBalance';
import CurrencyCard from '../components/CurrencyCard';
import CustomButton from '../components/CustomButton';
import styles from '../styles/common';

const Account = ({ navigation, route }) => {
  const [balance, setBalance] = useState('');
  const [nfts, setNfts] = useState([]);
  const [imageUris, setImageUris] = useState([]);
  const [loading, setLoading] = useState(true);
  const { publicKey } = route.params;
  const contractAddress = ''; // hard code contract address
  const truncatedKey = `${publicKey.slice(0, 7)}...${publicKey.slice(-5)}`;
  const thirdWindowsWidth = Dimensions.get('window').width / 3;
 
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        let balance = await getOptimismBalance(publicKey);
        if (balance === '0.') {
          balance = '0.0';
        }
        setBalance(balance);
      } catch (error) {
        console.log('Cannot complete fetchBalance: ', error);
      }
    };
    fetchBalance();
  }, []);

  const handleCopyToClipboard = () => {
    Clipboard.setString(publicKey);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.balanceContainer}>
        <TouchableOpacity onPress={handleCopyToClipboard}>
          <Card style={styles.card}>
            <View style={styles.keyContent}>
              <Text variant='titleLarge'>{truncatedKey}</Text>
              <Image
                source={require('../assets/copy_icon.png')}
                style={styles.copyImage}
              />
            </View>
          </Card>
        </TouchableOpacity>
        <CurrencyCard
          title="Optimism Balance"
          subtitle={balance}
          imageSource={require('../assets/optimism_logo.png')}
        />
        <View style={styles.transferButton}>
          <CustomButton text='Transfer Optimism' type='primary' size='large' onPress={() => { navigation.navigate('Transfer', { publicKey }); }} />
        </View>
      </View>
      <View style={styles.nftContainer}>
        <Text variant='titleLarge' style={styles.textMargin}>Your NFT Collection</Text>
        {nfts.length === 0 ? (
          <Text variant='bodyMedium' style={styles.textMargin}>Oops! Sorry this is under construction.</Text>
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
      <Card style={styles.card}>
        <Text variant='titleLarge' style={styles.textMargin}>About Us</Text>
        <Text variant='bodyMedium' style={styles.textMargin}>Anywhere Blockchain is building simple, safe, and more affordable key management tools for the future of finance, media, and governance. Our mobile application simplifies data ownership for users of Web 3 technology, using NFC chips to regenerate complex signing keys and passwords for the end user without storing them on remotely exploitable databases. This will have applications in the future of digital identity, social media, and blockchain-based computer transactions.</Text>
      </Card>
    </ScrollView>
  );
}

export default Account;


/**
 *   const openDetailsScreen = (nft, imageUri) => {
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
 */