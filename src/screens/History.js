import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import TransactionList from '../components/TransactionList';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

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
  const [monthData, setMonthData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const groupDataByMonth = (data) => {
    return data.reduce((acc, item) => {
      const date = new Date(item.age);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const monthYear = `${month}/${year}`;
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(item);
      return acc;
    }, {});
  };

  const formatDataByMonth = (data) => {
    const groupedData = groupDataByMonth(data);
    const formattedData = [];
    for (const monthYear in groupedData) {
      formattedData.push({ monthYear, data: groupedData[monthYear] });
    }
    return formattedData;
  };

  useEffect(() => {
    const fetchData = async () => {
      const formattedData = await Promise.resolve(formatDataByMonth(activity)); // Use await here
      setMonthData(formattedData);
      setIsLoading(false);
    };
    fetchData();
  }, [activity]); // Trigger useEffect whenever activity changes

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator>
        {/* Conditionally render TransactionListComponent based on isLoading */}
        {!isLoading && (
          <Tab.Screen name="Month" component={() => <TransactionListComponent formattedData={monthData} limit={1000} />} />
        )}
        <Tab.Screen name="Day" component={() => <TransactionList data={activity} limit={1000} />} />
      </Tab.Navigator>
    </View>
  );
};

export default History;


