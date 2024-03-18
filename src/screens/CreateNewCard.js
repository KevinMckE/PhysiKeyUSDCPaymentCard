import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import NavigationButton from '../components/NavigationButton';
import DatePickerInput from '../components/DatePickerInput';

const Login = ({ navigation }) => {
  return (
    <View style={styles.container}>

      <View style={styles.topContainer}>
        <Text style={styles.headingText}>Input a new date passcode.</Text>
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
  headingText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
  },
});

export default Login;