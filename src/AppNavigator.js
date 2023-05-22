import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './Screens/HomeScreen';
import KeyGen from './Screens/KeyGen';
import WriteNdefScreen from './Screens/WriteNdefScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Account Portal" component={KeyGen} />
        <Stack.Screen name="Create Link Phrase" component={WriteNdefScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
 
export default AppNavigator;