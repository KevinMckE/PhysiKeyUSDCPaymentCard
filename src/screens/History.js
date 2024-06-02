import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import TransactionList from '../components/TransactionList';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const History = ({ route }) => {
  const { activity } = route.params;
  const [dayData, setDayData] = useState([]);
  const [monthData, setMonthData] = useState([]);

  const groupDataByDay = (activity) => {
    return activity.reduce((acc, item) => {
      const date = new Date(item.age);
      const dateString = date.toDateString();
      if (!acc[dateString]) {
        acc[dateString] = [];
      }
      acc[dateString].push(item);
      return acc;
    }, {});
  };

  const groupDataByMonth = (activity) => {
    return activity.reduce((acc, item) => {
      const date = new Date(item.age);
      const yearMonthString = `${date.getFullYear()}-${date.getMonth()}`;
      if (!acc[yearMonthString]) {
        acc[yearMonthString] = [];
      }
      acc[yearMonthString].push(item);
      return acc;
    }, {});
  };

  useEffect(() => {
    setDayData(groupDataByDay(activity));
    setMonthData(groupDataByMonth(activity));
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator>
        <Tab.Screen name="Day" component={() => <TransactionList data={activity} limit={1000} />} />
        <Tab.Screen name="Month" component={() => <TransactionList data={activity} limit={1000}  />} />
      </Tab.Navigator>
    </View>
  );
};


export default History;