import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text} from 'react-native';
import HomeScreen from './Screens/HomeScreen';
import AccountPortal1 from './Screens/AccountPortal1';
import AccountPortal2 from './Screens/AccountPortal2';
import AccountDisplay from './Screens/AccountDisplay';
import AccountDisplayBTC from './Screens/AccountDisplayBTC';
import RawKeys from './Screens/RawKeys';
import CreateAccessCards from './Screens/CreateAccessCards';
import ManageAccessCards from './Screens/ManageAccessCards';
import ConceptApp from './Screens/ConceptApp';


const Stack = createStackNavigator();

function AppNavigator({navigation}) {

  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Concept App" component={ConceptApp} options={{headerShown: false}}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Account Portal 1" component={AccountPortal1} options={{headerShown: false}}/>
        <Stack.Screen name="Account Portal 2" component={AccountPortal2} options={{headerShown: false}}/>
        <Stack.Screen name="Raw Keys" component={RawKeys} options={{headerShown: false}}/>
        <Stack.Screen name="Account Display" component={AccountDisplay} options={{
          headerLeft: () => null, // Hide the back button
          headerTitle: 'Account Display ETH', // Set the title
        }}/>
        <Stack.Screen name="Account Display BTC" component={AccountDisplayBTC} options={{
          headerLeft: () => null, // Hide the back button
          headerTitle: 'Account Display BTC', // Set the title
        }}/>
        <Stack.Screen name="Create Access Cards" component={CreateAccessCards} />
        <Stack.Screen name="Manage Access Cards" component={ManageAccessCards} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
 
export default AppNavigator;