import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './Screens/HomeScreen';
import AccountPortal1 from './Screens/AccountPortal1';
import AccountPortal2 from './Screens/AccountPortal2';
import AccountDisplay from './Screens/AccountDisplay';
import AccountDisplayBTC from './Screens/AccountDisplayBTC';
import RawKeys from './Screens/RawKeys';


const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Account Portal 1" component={AccountPortal1} />
        <Stack.Screen name="Account Portal 2" component={AccountPortal2} />
        <Stack.Screen name="Raw Keys" component={RawKeys} />
        <Stack.Screen name="Account Display" component={AccountDisplay} />
        <Stack.Screen name="Account Display BTC" component={AccountDisplayBTC} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
 
export default AppNavigator;