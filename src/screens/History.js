import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import TransactionList from '../components/TransactionList';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { formatDataByDay, formatDataByMonth } from '../functions/base/getBaseUSDCActivity';

const Tab = createMaterialTopTabNavigator();

const TransactionListComponent = ({ formattedData, limit }) => {
  return (
    <View>
      {formattedData.map((monthData, index) => (
        <View key={index}>
          <Text>{monthData.monthYear}</Text>
          <TransactionList data={monthData.data} limit={limit} />
        </View>
      ))}
    </View>
  );
};

const History = ({ route }) => {
  const { activity } = route.params;
  const [dayData, setDayData] = useState([]);
  const [monthData, setMonthData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const day = await Promise.resolve(formatDataByDay(activity));
      const month = await Promise.resolve(formatDataByMonth(activity));
      setDayData(day);
      setMonthData(month);
    };
    fetchData();
  }, [activity]);

  return (
    <View style={{ flex: 1 }}>
    <Tab.Navigator>
      <Tab.Screen
        name="Month"
        component={() => <TransactionListComponent formattedData={monthData} limit={1000} />}
      />
      <Tab.Screen
        name="Day"
        component={() => <TransactionListComponent formattedData={dayData} limit={1000} />}
      />
    </Tab.Navigator>
  </View>

);};

export default History;



