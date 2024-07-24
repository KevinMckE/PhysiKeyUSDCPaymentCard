// libraries
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// context
import { AccountContext } from '../contexts/AccountContext';
// functions
import { formatDataByDay, formatDataByMonth } from '../functions/base/getBaseUSDCActivity';
// components
import TransactionList from '../components/TransactionList';
// styles
import styles from '../styles/common';

const Tab = createMaterialTopTabNavigator();

const MonthListComponent = ({ formattedData, limit }) => {
  return (
    <View>
      {formattedData.map((monthData, index) => (
        <View key={index}>
          <Text style={styles.textContainer}>{monthData.monthYear}</Text>
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
          <Text style={styles.textContainer}>{dayData.dayMonthYear}</Text>
          <TransactionList data={dayData.data} limit={limit} />
        </View>
      ))}
    </View>
  );
};

const History = () => {
 
  const { activity } = useContext(AccountContext);

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

  const RenderMonthListComponent = () => <MonthListComponent formattedData={monthData} limit={1000} />;
  const RenderDayListComponent = () => <DayListComponent formattedData={dayData} limit={1000} />;

  return (
    <>
      <ImageBackground
        source={require('../assets/background.png')}
        style={{ flex: 1, width: '100%', height: '100%' }}
      >
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={{
            tabBarIndicatorStyle: { backgroundColor: '#7FA324' }
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
    </ImageBackground >
    </>
  );
};

export default History;



