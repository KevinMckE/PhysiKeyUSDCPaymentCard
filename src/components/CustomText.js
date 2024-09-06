import React from 'react';
import { Text, StyleSheet } from 'react-native';

const CustomText = ({ size, text }) => {
  return (
    <Text style={styles.text}>
      {text}
    </Text>
  );
};

export default CustomText;

const styles = StyleSheet.create({
  text: {
    fontFamily: "LeagueSpartan-Regular", 
  },
});