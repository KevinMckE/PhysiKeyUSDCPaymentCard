import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, ImageBackground, Modal } from 'react-native';
import CurrencyCard from '../components/CurrencyCard';
import HorizontalImageGallery from '../components/HorizontalScrollGallery';

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
      <Text style={styles.headingText}>Welcome...</Text>
      <CurrencyCard
        title="Balance"
        subtitle="YEAH"
        imageSource={require('../assets/optimism_logo.png')}
      />
      <HorizontalImageGallery images={images} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
  },
  backgroundImage: {
    flex: 1,
    aspectRatio: 1,
  },
  headingText: {
    fontSize: 18,
    marginBottom: 25,
    color: '#000000',
    fontWeight: 'bold',
  },
});

export default Account;