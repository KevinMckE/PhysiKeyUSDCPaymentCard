import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import TransactionList from '../components/TransactionList';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const History = ({ route }) => {
  const { activity } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator>
        <Tab.Screen name="All" component={() => <TransactionList data={activity} limit={1000} />} />
      </Tab.Navigator>
    </View>
  );
  
};


export default History;