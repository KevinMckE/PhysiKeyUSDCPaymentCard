import * as React from 'react';
import { View, Image, TouchableOpacity, Linking } from 'react-native';
import { Text } from 'react-native-paper';
import CustomButton from '../components/CustomButton';
import styles from '../styles/common';

const Landing = ({ navigation }) => {
  const handleLinkPress = () => {
    Linking.openURL('https://anywhereaccess.io');
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.landingTopContainer}>
          <Image
            source={require('../assets/regen_card.png')}
            style={styles.centeredImage}
          />
        </View>
        <View style={styles.landingBottomContainer}>
          <CustomButton text='Login' type='primary' size='large' onPress={() => { navigation.navigate('Login'); }} />
          <Text variant="bodyLarge">Don't have a card?</Text>
          <Text><TouchableOpacity onPress={handleLinkPress}><Text style={styles.linkText}>Learn more here</Text></TouchableOpacity></Text>
        </View>
      </View>
    </>
  );
}

export default Landing;