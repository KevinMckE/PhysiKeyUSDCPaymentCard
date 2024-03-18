import React from 'react';
import { View, StyleSheet } from 'react-native';
import NavigationButton from '../components/NavigationButton';
import DatePickerInput from '../components/DatePickerInput';

const Login = ({ navigation }) => {
  const handleDateChange = (selectedDate) => {
    console.log(selectedDate); // Do something with the selected date
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.paragraphText}>Don't have a card?</Text>
        <DatePickerInput onDateChange={handleDateChange} />
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
  },
  topContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paragraphText: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default Login;
