//------------------------------------------------------------------------------//
// NFT List
//------------------------------------------------------------------------------//
// Using the public key and Tatum.io list all NFTs in the address wallet        //
// Display the image and number of NFTs                                         //
// Select NFT to navigate to a page with full details of the asset              //
//------------------------------------------------------------------------------//
// Mark Lisanti 2024, https://github.com/marklasagne/rn-nft/                    //
//------------------------------------------------------------------------------//

import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, StyleSheet, FlatList, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { TatumSDK, Network, ApiVersion, Ethereum, Polygon, ResponseDto, NftAddressBalance, NftTokenDetail } from '@tatumio/tatum';
import CustomSnackbar from '../../components/CustomSnackbar';
import Web3 from 'web3';
import Config from 'react-native-config';

const NFTList = (props) => {

  const {navigation} = props;
  const route = useRoute();
  let { data } = route.params;
  const { publicKey, oneTimeEncryptionPW, encryptedPrivateKey } = data;

  const [nfts, setNfts] = useState([]);
  const [isSuccess, setSuccess] = useState(false);
  const [imageUris, setImageUris] = useState([]);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const [header, setHeader] = useState('');
  const [loading, setLoading] = useState(true);

  const truncatedKey = `${publicKey.slice(0, 7)}...${publicKey.slice(-5)}`;
  const halfWindowsWidth = Dimensions.get('window').width / 2;
  const web3Instance = new Web3('https://api.tatum.io/v3/blockchain/node/ethereum-sepolia/' + Config.TATUM_API_KEY);


  const viewNFTs = async () => {
    try {
        const tatum = await TatumSDK.init({ 
          network: Network.ETHEREUM_SEPOLIA,
          version: ApiVersion.V4,
          apiKey: { v4: '' + Config.TATUM_API_KEY } });
      const nftsResponse = await tatum.nft.getBalance({
        addresses: [publicKey],
      });
      if (nftsResponse.data == null) {
        setHeader('This collection appears to be empty...');
      } else {
        setNfts(nftsResponse.data);
        setLoading(false);
        setHeader(`You are now viewing the collection of ${truncatedKey}`);
        handleSnackbar(true, 'Successfully retrieved your collection...');
      }
    } catch (error) {
      setLoading(false);
      setHeader(`There was an issue: ${error}`);
      handleSnackbar(false, `Error: ${error}`)
    }
  };

  const getImageUri = async (item) => {
    const originalUrl = item.metadataURI;
    if (originalUrl.startsWith('https://')) {
      const response = await fetch(originalUrl);
      const responseBodyText = await response.text();
      const responseData = JSON.parse(responseBodyText);
      const uri = responseData.image;
      return uri;
    } else {
      const convertedUrl = originalUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
      const response = await fetch(convertedUrl);
      const responseBodyText = await response.text();
      const responseData = JSON.parse(responseBodyText);
      const uri = responseData.image;
      const convertedUri = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
      return convertedUri;
    }
  };

  const openDetailsScreen = (nft, imageUri) => {
    data = { publicKey, oneTimeEncryptionPW, encryptedPrivateKey, selectedNFT: nft, imageUri  };
    navigation.navigate('NFTView', { data });
  };

  const handleSnackbar = (success, text) => {
    setSuccess(success);
    setSnackbarText(text);
    setSnackbarVisible(true);
  };

  useEffect(() => {
    viewNFTs();
  }, []);

  useEffect(() => {
    const fetchImageUris = async () => {
      const uris = await Promise.all(
        nfts.map(async (item) => {
          const uri = await getImageUri(item);
          return uri;
        })
      );
      setImageUris(uris);
    };
    fetchImageUris();
  }, [nfts]);

  const renderNFTCard = ({ item, index }) => (
    <TouchableOpacity onPress={() => openDetailsScreen(item, imageUris[index])}>
      <Card mode='contained' >
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} />
        ) : (
          <Card.Cover source={{ uri: imageUris[index] }} style={{ width: halfWindowsWidth, height: halfWindowsWidth }} />
        )}
      </Card>
    </TouchableOpacity>
  );

  return (
    <>
      <View>
        <Text style={styles.defaultSpacing}>{header}</Text>
        <FlatList
          data={nfts}
          renderItem={renderNFTCard}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={{ gap: 15 }}
        />
      </View>
      <CustomSnackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={10000}
        text={snackbarText}
        isSuccess={isSuccess}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalStyle: {
    padding: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  defaultSpacing: {
    width: 250,
    marginBottom: 20,
  },
});

export default NFTList;

