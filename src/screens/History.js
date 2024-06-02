import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import TransactionList from '../components/TransactionList';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { formatDataByDay, formatDataByMonth } from '../functions/base/getBaseUSDCActivity';

const Tab = createMaterialTopTabNavigator();

const MonthListComponent = ({ formattedData, limit }) => {
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

const DayListComponent = ({ formattedData, limit }) => {
  return (
    <View>
      {formattedData.map((dayData, index) => (
        <View key={index}>
          <Text>{dayData.dayMonthYear}</Text>
          <TransactionList data={dayData.data} limit={limit} />
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
      console.log(day

      )
      const month = await Promise.resolve(formatDataByMonth(activity));
      setDayData(day);
      setMonthData(month);
    };
    fetchData();
  }, [activity]);

  const RenderMonthListComponent = () => <MonthListComponent formattedData={monthData} limit={1000} />;
  const RenderDayListComponent = () => <DayListComponent formattedData={dayData} limit={1000} />;

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
       tabBarOptions={{
        indicatorStyle: { backgroundColor: '#7FA324' } 
      }}
      >
        <Tab.Screen
          name="Month"
          component={RenderMonthListComponent}
        />
        <Tab.Screen
          name="Day"
          component={RenderDayListComponent}
        />
      </Tab.Navigator>
    </View>

  );
};

export default History;



