import * as React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import NavigationButton from '../components/NavigationButton';

const Landing = ({ navigation }) => {

  const handleLinkPress = () => {
    Linking.openURL('https://anywhereaccess.io');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Image
          source={require('../assets/blob_background.png')}
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
        <Text><TouchableOpacity onPress={handleLinkPress}><Text style={styles.linkText}>Reach out to us here.</Text></TouchableOpacity></Text>
      </View>
    </View>
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
    opacity: 0.3,
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