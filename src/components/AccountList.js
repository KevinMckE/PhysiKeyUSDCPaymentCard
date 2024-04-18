import React from 'react';
import { StyleSheet, ScrollView, Text, Pressable, View, Image } from 'react-native';
import { List, Card } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';
import { removeItemFromAsyncStorage, getData } from '../functions/asyncStorage';

const AccountList = ({ data, navigation, setData }) => {

  const renderRightActions = (item) => (
    <Pressable
      onPress={() => handleRemoveItem(item)}
      style={styles.rightAction}
    >
      <View style={styles.removeButton}>
        <Text style={styles.text}>Remove</Text>
      </View>
    </Pressable>
  );

  const handleRemoveItem = async (item) => {
    try {
      await removeItemFromAsyncStorage(item.key);
      const updatedData = await getData();
      setData(updatedData);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  return (
    <Card style={styles.card}>
      <ScrollView style={styles.container}>
        <List.Section>
          {data.map((item, index) => (
            <Swipeable
              key={index}
              renderRightActions={() => renderRightActions(item)}
            >
              <Pressable
                onPress={() => navigation.navigate('Account', { publicKey: item.value, snackbarMessage: 'Successfully logged in!' })}
              >
                <View style={styles.listItem}>
                  <List.Item
                    title={`${item.key}`}
                    description={`${item.value ? item.value.slice(0, 10) + '...' + item.value.slice(-10) : ''}`}
                  />
                  <Image source={require('../assets/drag_handle.png')} style={styles.icon} />
                </View>
              </Pressable>
            </Swipeable>
          ))}
        </List.Section>
      </ScrollView>
    </Card>
  );
};

export default AccountList;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    width: '100%',
    height: '100%',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 3,
    gap: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#7da1ff',
  },
  card: {
    backgroundColor: '#ffffff',
    flex: 5,
    width: '90%',
  },
  rightAction: {
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderRadius: 15,
  },
  rightActionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  removeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#de0a26',
    flexDirection: 'row',
    margin: 3,
    gap: 10,
    width: '95%',
    borderRadius: 15
  },
  icon: {
    width: 40,
    height: 40,
  }
});