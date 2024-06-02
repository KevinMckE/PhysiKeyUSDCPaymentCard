import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles/common';
import TransactionList from '../components/TransactionList';

const History = ({ navigation, route }) => {
  const { label, publicKey, balance, activity } = route.params; // Accessing parameters from route

  return (
    <>
      <TransactionList
        navigation={navigation}
        data={activity}
        limit={2000}
      />
    </>
  );
}

export default History;
