import * as React from 'react';
import { View, ImageBackground, StyleSheet, TouchableOpacity, Text } from 'react-native';
import CustomButton from '../components/NavigationButton';

const Landing = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/blob_background.png')} // Replace with the path to your background image
        style={styles.backgroundImage}

      >
        {/* Content for the top 2/3 of the screen */}
      </ImageBackground>
      <View style={styles.bottomContainer}>
        {/* Content for the bottom 1/3 of the screen */}
        <TouchableOpacity style={styles.button}>
          <CustomButton navigation={navigation} text='Scan Card' type='primary' target='Screen1' size='large' />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 2,
    resizeMode: 'stretch', // or 'contain' depending on your preference
    height: "200%",
    top: 0,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Landing;