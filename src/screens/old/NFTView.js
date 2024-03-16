//------------------------------------------------------------------------------//
// NFT Detail View
//------------------------------------------------------------------------------//
// Displays the full NFT details of an item in the wallet                       //
// Gives users an option to transfer the NFT using private key  
// User chain explorer to determine standard and save ABI                       //
//------------------------------------------------------------------------------//
// Mark Lisanti 2024, https://github.com/marklasagne/rn-nft/                    //
//------------------------------------------------------------------------------//

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Snackbar, Modal, Button, TextInput, Portal } from 'react-native-paper';
import CustomSnackbar from './CustomSnackbar';
import Config from 'react-native-config';
import Web3 from 'web3';

const NFTDetailsScreen = (props) => {

  const {navigation} = props;
  const route = useRoute();
  const { data } = route.params;
  const { publicKey, oneTimeEncryptionPW, encryptedPrivateKey, selectedNFT, imageUri  } = data;

  const [transferResult, setTransferResult] = useState('');
  const [ercStandard, setStandard] = useState('');
  const [abi, setABI] = useState();
  const [recipientWallet, setRecipientWallet] = useState('');
  const [senderPrivateKey, setSenderPrivateKey] = useState('');

  const [visible, setVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const [isSuccess, setSuccess] = useState(false);

  const web3Instance = new Web3('https://api.tatum.io/v3/blockchain/node/ethereum-sepolia/' + Config.TATUM_API_KEY);
  
  const getABI = async (apiUrl) => {
    try {
      const { status, result } = await (await fetch(apiUrl)).json();
      if (status === '1') {
        const contractABI = JSON.parse(result);
        setABI(contractABI);
        if (contractABI && contractABI.length > 0) {
          const isERC721 = contractABI.some(
            (item) =>
              item.type === 'function' &&
              (item.name === 'balanceOf' && item.name === 'ownerOf')
          );
          const isERC1155 = contractABI.some(
            (item) =>
              item.type === 'function' &&
              (item.name === 'balanceOfBatch' || item.name === 'safeBatchTransferFrom')
          );
          if (isERC721) {
            setStandard('ERC721');
          } else if (isERC1155) {
            setStandard('ERC1155');
          } else {
            setStandard('NONE');
          }
        } else {
          setStandard('EMPTY');
        }
      }
    } catch (error) {
      handleSnackbar(false, `There was an issue: ${error}`);
    }
  };

  const setAPI = () => {
    
    apiUrl = `https://api.etherscan.io/api?module=contract&action=getabi&address=${selectedNFT.tokenAddress}&apikey=${Config.ETHERSCAN_API_KEY}`;
    
    return apiUrl;
  };

  const transferNFT = async () => {
    try {
      const privateKey = senderPrivateKey;
      const contractAddress = selectedNFT.tokenAddress;
      const tokenId = selectedNFT.tokenId;
      const senderAddress = publicKey;
      const recipientAddress = recipientWallet;
      const value = 1;

      const nftContract = new web3Instance.eth.Contract(abi, contractAddress);
  
      let transferTransaction;
      if (ercStandard === 'ERC721') {
        transferTransaction = nftContract.methods.transferFrom(senderAddress, recipientAddress, tokenId);
      } else if (ercStandard === 'ERC1155'){
        transferTransaction = nftContract.methods.safeTransferFrom(senderAddress, recipientAddress, tokenId, value, '0x');
      }

      handleSnackbar(true, '(1/3) Estimating the gas for the transfer...');
      const gasEstimate = await transferTransaction.estimateGas({ from: senderAddress });

      const rawTransaction = {
        from: senderAddress,
        to: contractAddress,
        gas: gasEstimate,
        data: transferTransaction.encodeABI(),
        gasPrice: await web3Instance.eth.getGasPrice(),
        nonce: await web3Instance.eth.getTransactionCount(senderAddress),
      };

      handleSnackbar(true, '(2/3) Signing the transaction...');
      const signedTransaction = await web3Instance.eth.accounts.signTransaction(rawTransaction, privateKey);
      
      handleSnackbar(true, '(3/3) Sending the signed transaction...');
      const receipt = await web3Instance.eth.sendSignedTransaction(signedTransaction.rawTransaction);
 
      handleSnackbar(true, `Completed! Transaction receipt has been logged...`);
      setTransferResult(receipt);
      console.log(transferResult);
    } catch (error) {
      handleSnackbar(false, `Error transferring NFT: ${error.message}`);
    }
  };

  const handleSnackbar = (success, text) => {
    setSuccess(success);
    setSnackbarText(text);
    setSnackbarVisible(true);
  };

  useEffect(() => {
    const apiUrl = setAPI();
    getABI(apiUrl);
  }, []);

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
      <Text style={styles.defaultSpacing}>{`Standard: ${ercStandard}`}</Text>
      <Button
        mode="contained"
        style={styles.defaultSpacing}
        onPress={() => setVisible(true)}>
        Transfer NFT
      </Button>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          style={styles.modalStyle}>
          <View>
            <Image
              style={{ ...styles.defaultSpacing, width: 100, height: 100, marginRight: 50 }}
              source={{
                uri: imageUri,
              }}
            />
            <Text style={styles.defaultSpacing}>{`Token ID: #${selectedNFT?.tokenId}`}</Text>
            <Text style={styles.defaultSpacing}>{`Token Address: ${selectedNFT?.tokenAddress}`}</Text>
            <Text style={styles.defaultSpacing}>{`Chain: ${selectedNFT?.chain}`}</Text>
            <Text style={styles.defaultSpacing}>{`Standard: ${ercStandard}`}</Text>
            <TextInput
              label="Recipient Address"
              style={styles.defaultSpacing}
              mode={'outlined'}
              value={recipientWallet}
              onChangeText={recipientWallet => setRecipientWallet(recipientWallet)} />
            <TextInput
              label="Sign With Private Key"
              style={styles.defaultSpacing}
              mode={'outlined'}
              value={senderPrivateKey}
              onChangeText={senderPrivateKey => setSenderPrivateKey(senderPrivateKey)} />
            <Button
              mode="contained"
              style={styles.defaultSpacing}
              onPress={transferNFT}>
              Transfer
            </Button>
            <Button
              mode="contained"
              style={{ ...styles.defaultSpacing, backgroundColor: '#8B0000' }}
              onPress={() => setVisible(false)}>
              Go Back
            </Button>
          </View>
        </Modal>
        <CustomSnackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          text={snackbarText}
          isSuccess={isSuccess}
        />
      </Portal>
    </View>
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

export default NFTDetailsScreen;