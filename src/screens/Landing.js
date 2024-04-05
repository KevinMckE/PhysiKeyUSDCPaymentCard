import * as React from 'react';
import { View, Image, TouchableOpacity, Linking, ImageBackground } from 'react-native';
import { Text } from 'react-native-paper';
import NavigationButton from '../components/NavigationButton';
import styles from '../styles/common';

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
          <Text variant="bodyLarge">Don't have a card?</Text>
          <Text><TouchableOpacity onPress={handleLinkPress}><Text style={styles.linkText}>Get one here</Text></TouchableOpacity></Text>
        </View>
      </View>
    </ImageBackground>
  );
}

export default Landing;