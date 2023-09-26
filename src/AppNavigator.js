import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './Screens/HomeScreen';
import AccountPortal1 from './Screens/AccountPortal1';
import AccountPortal2 from './Screens/AccountPortal2';
import AccountDisplay from './Screens/AccountDisplay';
import AccountDisplayBTC from './Screens/AccountDisplayBTC';
import RawKeys from './Screens/RawKeys';
import CreateAccessCard from './Screens/CreateAccessCard';


const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Account Portal 1" component={AccountPortal1} />
        <Stack.Screen name="Account Portal 2" component={AccountPortal2} options={{headerShown: false}}/>
        <Stack.Screen name="Raw Keys" component={RawKeys} />
        <Stack.Screen name="Account Display" component={AccountDisplay} options={{headerShown: false}}/>
        <Stack.Screen name="Account Display BTC" component={AccountDisplayBTC} options={{headerShown: false}}/>
        <Stack.Screen name="Create Access Card" component={CreateAccessCard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
 
export default AppNavigator;