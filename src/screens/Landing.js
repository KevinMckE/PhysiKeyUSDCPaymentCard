import * as React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
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
          source={require('../assets/card_rotate_animation.gif')}
          style={styles.centeredImage}
        />
      </View>
      <View style={styles.bottomContainer}>
        <NavigationButton navigation={navigation} text='Scan Card' type='primary' target='LoginDate' size='large' />
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
});

export default Landing;