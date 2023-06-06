import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './Screens/HomeScreen';
import AccountPortal from './Screens/AccountPortal';
import WriteNdefScreen from './Screens/WriteNdefScreen';
import AccountDisplay from './Screens/AccountDisplay';
import RawKeys from './Screens/RawKeys';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Account Portal" component={AccountPortal} />
        <Stack.Screen name="Raw Keys" component={RawKeys} />
        <Stack.Screen name="Account Display" component={AccountDisplay} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
 
export default AppNavigator;