import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { Card } from 'react-native-paper';
import CurrencyCard from '../components/CurrencyCard';
import HorizontalImageGallery from '../components/HorizontalScrollGallery';
import NavigationButton from '../components/NavigationButton';

const Account = ({ navigation }) => {

  const images = [
    require('../assets/optimism_logo.png'),
    require('../assets/optimism_logo.png'),
    require('../assets/optimism_logo.png'),
    require('../assets/optimism_logo.png'),
    require('../assets/optimism_logo.png'),
    require('../assets/optimism_logo.png'),
    require('../assets/optimism_logo.png'),
  ];
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/blob_background.png')}
        style={styles.backgroundImage}
        resizeMode="contain"
      />
      <CurrencyCard
        title="Balance"
        subtitle="YEAH"
        imageSource={require('../assets/optimism_logo.png')}
      />
      <Text style={styles.headingText}>Your NFT Collection</Text>
      <HorizontalImageGallery images={images} />
      <NavigationButton navigation={navigation} text='View All' type='primary' target='NftCollection' size='large' />
      <Text style={styles.headingText}>About Us</Text>

      <Card style={styles.card}>
        <Text style={styles.paragraphText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
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