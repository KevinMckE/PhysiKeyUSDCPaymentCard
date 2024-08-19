/////////////////////////////////
// LANDING PAGE   ///////////////
// Direct users between        //
// instant accept or           //
// logging into a new account  //
// RegenCard 2024           /////
/////////////////////////////////

// libraries
import * as React from 'react';
import { View, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { Text } from 'react-native-paper';
// components
import CustomButton from '../components/CustomButton';
// styles
import styles from '../styles/common';

const Landing = ({ navigation }) => {
  const handleLinkPress = () => {
    navigation.navigate('WebViewScreen', { url: 'https://anywhereaccess.io' });
  };

  return (
    <>
      <ImageBackground
        source={require('../assets/background.png')}
        style={{ flex: 1, width: '100%', height: '100%' }}
      >
        <View style={styles.container}>
          <View style={styles.landingTopContainer}>
            <Image
              source={require('../assets/regen_card.jpg')}
              style={styles.centeredImage}
            />
          </View>
          <View style={styles.landingBottomContainer}> 
            <CustomButton text='Instant Accept' type='primary' size='large' onPress={() => { navigation.navigate('InstantAcceptLogin')}} />
            <CustomButton text='Card Login' type='secondary' size='large' onPress={() => { navigation.navigate('Login'); }} />
            <Text variant="bodyLarge">Don't have a card?</Text>
            <Text><TouchableOpacity onPress={handleLinkPress}><Text style={styles.linkText}>Learn more here</Text></TouchableOpacity></Text>
          </View>
        </View>
      </ImageBackground>
    </>
  );
}

export default Landing;