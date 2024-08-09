// libraries
import React, { useState, useEffect, useContext } from 'react';
import { View, ImageBackground } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// context
import { AccountContext } from '../contexts/AccountContext';
// functions
import { formatDataByDay, formatDataByMonth } from '../functions/core/getOptimismUSDCActivity';
// components
import DayListComponent from '../components/MonthActivityList';
import MonthListComponent from '../components/DayActivityList';

const Tab = createMaterialTopTabNavigator();

const History = () => {
  const { activity } = useContext(AccountContext);

  const [dayData, setDayData] = useState([]);
  const [monthData, setMonthData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const day = formatDataByDay(activity);
        const month = formatDataByMonth(activity);
        setDayData(day);
        setMonthData(month);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [activity]);

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={{ flex: 1, width: '100%', height: '100%' }}
    >
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={{
            tabBarIndicatorStyle: { backgroundColor: '#94BE43' }
          }}
        >
          <Tab.Screen
            name="Month"
            children={() => <MonthListComponent formattedData={monthData} limit={1000} />}
          />
          <Tab.Screen
            name="Day"
            children={() => <DayListComponent formattedData={dayData} limit={1000} />}
          />
        </Tab.Navigator>
      </View>
    </ImageBackground>
  );
};

export default History;
