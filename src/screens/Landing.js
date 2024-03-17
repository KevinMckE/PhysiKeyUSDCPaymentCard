import * as React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import CustomButton from '../components/NavigationButton';

//source={require('../assets/blob_background.png')}
const Landing = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Image
          source={require('../assets/card_rotate_animation.gif')}
          style={styles.centeredImage}
        />
      </View>
      <View style={styles.bottomContainer}>
        <CustomButton navigation={navigation} text='Scan Card' type='primary' target='Login' size='large' />
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
    backgroundImage: require('../assets/blob_background.png')
  },
  centeredImage: {

  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Landing;