import * as React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import NavigationButton from '../components/NavigationButton';
import CardAnimation from '../assets/card_animation.mp4';

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
        <Video
          source={CardAnimation}
          resizeMode="cover"
          style={styles.video}
        />
      </View>
      <View style={styles.bottomContainer}>
        <NavigationButton navigation={navigation} text='Scan Card' type='primary' target='Login' size='large' />
        <Text style={styles.paragraphText}>Don't have a card?</Text>
        <Text><TouchableOpacity onPress={handleLinkPress}><Text style={styles.linkText}>Get one here.</Text></TouchableOpacity></Text>
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
    width: '150%',
    height: '150%'
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
  },
  video: {
    height: 300, // Increase the height
    width: 300, // Increase the width
  }
});

export default Landing;