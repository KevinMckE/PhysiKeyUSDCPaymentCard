import * as React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import {Text } from 'react-native-paper';

const NftDetails = ({ route }) => {
  const { publicKey, selectedNFT, imageUri } = route.params;

  return (
    <View style={styles.container}>
      <Image
        style={{ ...styles.defaultSpacing, width: 200, height: 200 }}
        source={{
          uri: imageUri,
        }}
      />
      <Text style={styles.defaultSpacing}>{`Token ID: #${selectedNFT?.tokenId}`}</Text>
      <Text style={styles.defaultSpacing}>{`Token Address: ${selectedNFT?.tokenAddress}`}</Text>
      <Text style={styles.defaultSpacing}>{`Chain: ${selectedNFT?.chain}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  defaultSpacing: {
    width: 250,
    marginBottom: 20,
  },
});

export default NftDetails;
