import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import { getOptimismBalance, getOptimismWalletActivity } from '../components/HelperFunctions';
import CurrencyCard from '../components/CurrencyCard';
import HorizontalImageGallery from '../components/HorizontalScrollGallery';
import NavigationButton from '../components/NavigationButton';

const Account = ({ navigation }) => {
  const [balance, setBalance] = useState('');
  const [images, setImages] = useState([
    require('../assets/optimism_logo.png'),
    require('../assets/optimism_logo.png'),
    require('../assets/optimism_logo.png'),
    require('../assets/optimism_logo.png'),
    require('../assets/optimism_logo.png'),
    require('../assets/optimism_logo.png'),
    require('../assets/optimism_logo.png'),
  ]);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const address = '0x179F961d5A0cC6FCB32e321d77121D502Fe3abF4';
        const balance = await getOptimismBalance(address);
        setBalance(balance);
      } catch (error) {
        console.warn(error);
      }
    };
    fetchBalance();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.balanceContainer}>
        <CurrencyCard
          title="Balance"
          subtitle={balance}
          imageSource={require('../assets/optimism_logo.png')}
        />
      </View>
      <View style={styles.nftContainer}>
        {images.length === 0 ? (
          <Text style={styles.errorText}>Oops! You do not have any NFTs in this wallet.</Text>
        ) : (
          <>
            <Text style={styles.headingText}>Your NFT Collection</Text>
            <HorizontalImageGallery images={images} />
            <NavigationButton navigation={navigation} text='View All' type='primary' target='NftCollection' size='large' />
          </>
        )}
      </View>
      <View style={styles.aboutContainer}>
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
  backgroundImage: {
    transform: [{ rotate: '-45deg' }],
    position: 'absolute'
  },
  card: {
    margin: 10,
    backgroundColor: '#ffffff',
  },
});

export default Account;