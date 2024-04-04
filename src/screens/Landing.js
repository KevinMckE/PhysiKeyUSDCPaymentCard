import * as React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, Linking, ImageBackground } from 'react-native';
import NavigationButton from '../components/NavigationButton';

const Landing = ({ navigation }) => {

  const handleLinkPress = () => {
    Linking.openURL('https://anywhereaccess.io');
  };

  return (
    <ImageBackground
      source={require('../assets/tech_pattern.jpg')}
      style={{ flex: 1, width: '100%', height: '100%' }}
    >
      <View style={styles.container}>
        <View style={styles.topContainer}>
        <Image
            source={require('../assets/blob_background_blue.png')}
            style={styles.backgroundImageSecondary}
          />
          <Image
            source={require('../assets/blob_background_black.png')}
            style={styles.backgroundImage}
          />

          <Image
            source={require('../assets/card_animation.gif')}
            style={styles.centeredImage}
          />

        </View>
        <View style={styles.bottomContainer}>
          <NavigationButton navigation={navigation} text='Access Card' type='primary' target='Login' size='large' />
          <Text style={styles.paragraphText}>Don't have a card?</Text>
          <Text><TouchableOpacity onPress={handleLinkPress}><Text style={styles.linkText}>Get one here</Text></TouchableOpacity></Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    height: 650,
    opacity: 1,
  },
  backgroundImageSecondary: {
    position: 'absolute',
    width: '100%',
    height: 680,
    opacity: 1,
  },
  centeredImage: {
    width: '85%',
    height: '85%'
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: 18,
  },
  paragraphText: {
    color: '#000000',
    fontSize: 18,
  }
});

export default Landing;