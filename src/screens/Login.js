import React, { useState } from 'react';
import { View, Image, StyleSheet, Text, ImageBackground } from 'react-native';
import NavigationButton from '../components/NavigationButton';
import DatePickerInput from '../components/DatePickerInput';

const Login = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.headingTitle}>Access Assets</Text>
        <Text style={styles.headingText}>Scan your card and input Date Passcode.</Text>
      </View>
      
      <View style={styles.imageContainer}>
        <ImageBackground
          source={require('../assets/blob_background.png')}
          style={styles.backgroundImage}
          resizeMode="contain" 
        >
        <Image
          source={require('../assets/tap_animation.gif')}
          style={styles.centeredImage}
          resizeMode="cover"
        />
        </ImageBackground>
      </View>

      <View style={styles.inputContainer}>
        <DatePickerInput />
      </View>

      <View style={styles.bottomContainer}>
        <NavigationButton navigation={navigation} text='Go Back' type='secondary' target='Landing' size='large' />
        <NavigationButton navigation={navigation} text='Continue' type='primary' target='Login' size='large' />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
  },
  topContainer: {
    flex: 1,
    padding: 30,
  },
  imageContainer: {
    alignItems: 'center',
    flex: 2,
  },
  backgroundImage: {
    flex: 1,
    aspectRatio: 1, 
  },
  centeredImage: {
    width: '100%',
    height: '100%',
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
  },
  bottomContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingTitle: {
    fontSize: 24,
    color: '#000000',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  headingText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
  },
});

export default Login;