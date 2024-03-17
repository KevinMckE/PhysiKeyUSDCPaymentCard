import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text} from 'react-native';
import HomeScreen from '../screens/old/HomeScreen';
import AccountPortal1 from '../screens/old/AccountPortal1';
import AccountPortal2 from '../screens/old/AccountPortal2';
import AccountDisplay from '../screens/old/AccountDisplay';
import AccountDisplayBTC from '../screens/old/AccountDisplayBTC';
import RawKeys from '../screens/old/RawKeys';
import CreateAccessCards from '../screens/old/CreateAccessCards';
import ManageAccessCards from '../screens/old/ManageAccessCards';
import ConceptApp from '../screens/old/ConceptApp';
import ConceptAppAccountDisplay from '../screens/old/ConceptAppAccountDisplay';
import NFTList from '../screens/old/NFTList';
import NFTView from '../screens/old/NFTView';


const Stack = createStackNavigator();

function AppNavigator({navigation}) {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Concept App" component={ConceptApp} options={{
            headerShown: false,// Set the title
          }}/>
        <Stack.Screen name="Concept App Account Display" component={ConceptAppAccountDisplay} options={{
            headerBackTitle: 'Back',
            headerTitle: 'Account Display', // Set the title
          }}/>
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
        <Stack.Screen
            name="NFTList"
            component={NFTList}
            options={{
              title: 'NFT Collection',
              headerStyle: {
                backgroundColor: '#ffffff',
              },
              headerTintColor: '#303030',
            }}
          />
          <Stack.Screen
            name="NFTView"
            component={NFTView}
            options={{
              title: 'Item Details',
              headerStyle: {
                backgroundColor: '#ffffff',
              },
              headerTintColor: '#303030',
            }}
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
 
export default AppNavigator;