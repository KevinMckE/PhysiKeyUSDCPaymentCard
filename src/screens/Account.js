import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Image, ImageBackground, Pressable } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useIsFocused } from '@react-navigation/native';
import { Text, Card } from 'react-native-paper';
import { getOptimismBalance } from '../functions/getOptimismBalance';
import CurrencyCard from '../components/CurrencyCard';
import CustomSnackbar from '../components/CustomSnackbar';
import styles from '../styles/common';

const Account = ({ navigation, route }) => {
  const [balance, setBalance] = useState('');
  const { publicKey, snackbarMessage } = route.params;
  const truncatedKey = `${publicKey.slice(0, 7)}...${publicKey.slice(-5)}`;
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const [isSuccess, setSuccess] = useState(false);

  const isFocused = useIsFocused(); 

  useEffect(() => {
    let isMounted = true; 
    const fetchBalance = async () => {
      handleSnackbar(true, snackbarMessage);
      try {
        let fetchedBalance = await getOptimismBalance(publicKey);
        if (fetchedBalance === '0.') {
          fetchedBalance = '0.0';
        }
        if (isMounted && isFocused) {
          setBalance(fetchedBalance);
        }
      } catch (error) {
        console.log('Cannot complete fetchBalance: ', error);
      }
    };
    if (isFocused) {
      fetchBalance();
    }
    return () => {
      isMounted = false;
    };
  }, [publicKey, snackbarMessage, isFocused]);

  const handleCopyToClipboard = () => {
    Clipboard.setString(publicKey);
  };

  const handleSnackbar = (success, text) => {
    setSuccess(success);
    setSnackbarText(text);
    setSnackbarVisible(true);
  };

  return (
    <ImageBackground
      source={require('../assets/tech_pattern.jpg')}
      style={{ flex: 1, width: '100%', height: '100%' }}
    >
        <View style={styles.balanceContainer}>
          <Pressable onPress={handleCopyToClipboard}>
            <Card style={styles.card}>
              <View style={styles.keyContent}>
                <Text variant='titleLarge'>{truncatedKey}</Text>
                <Image
                  source={require('../assets/copy_icon.png')}
                  style={styles.copyImage}
                />
              </View>
            </Card>
          </Pressable>
          <CurrencyCard
            title="Balance"
            subtitle={balance}
            imageSource={require('../assets/optimism_logo.png')}
            navigation={navigation}
            publicKey={publicKey}
          />
        </View>

        <CustomSnackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          text={snackbarText}
          isSuccess={isSuccess}
        />
    </ImageBackground>
  );
}

export default Account;
