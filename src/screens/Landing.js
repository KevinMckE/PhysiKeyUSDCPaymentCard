/////////////////////////////////
// LANDING PAGE   ///////////////
// Direct users between        //
// instant accept or           //
// logging into a new account  //
// RegenCard 2024           /////
/////////////////////////////////

// libraries
import React from 'react';
import { View, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { Text } from 'react-native-paper';
// components
import CustomButton from '../components/CustomButton';
import CustomText from '../components/CustomText'
// styles
import styles from '../styles/common';

const Landing = ({ navigation }) => {
  const handleLinkPress = () => {
    navigation.navigate('WebViewScreen', { url: 'https://regencard.app' });
  };

  return (
    <>
      <ImageBackground
        source={require('../assets/background.png')}
        style={styles.backgroundImage}
      >
        <View style={[{ flex: 5 }, styles.center]}>
          <Image
            source={require('../assets/regen_card_logo_color.png')}
            style={{ width: '100%', height: '100%', }}
          />
        </View>
        <View style={[{ flex: 2, justifyContent: 'center', gap: 16 }, styles.center]}>
          <CustomButton text='Accept Payment' type='primary' size='large' onPress={() => { navigation.navigate('InstantAccept') }} />
          <CustomButton text='Card Manager' type='secondary' size='large' onPress={() => { navigation.navigate('Login'); }} />
        </View>
        <View style={[{ flex: 1 }, styles.center]}>
          <CustomText text={"Don't have a card?"} />
          <TouchableOpacity onPress={handleLinkPress}><Text style={{color: 'blue', textDecorationLine: 'underline', fontSize: 16}}>Learn more here</Text></TouchableOpacity>
        </View>
      </ImageBackground>
    </>
  );
}

export default Landing;