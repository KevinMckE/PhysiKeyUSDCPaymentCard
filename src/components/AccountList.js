import React from 'react';
import { StyleSheet, ScrollView, Text, Pressable } from 'react-native';
import { List, Card } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';
import { removeItemFromAsyncStorage, getData } from '../functions/asyncStorage';

const AccountList = ({ data, navigation, setData }) => {

  const renderRightActions = (item) => (
    <Pressable
      onPress={() => handleRemoveItem(item)}
      style={styles.rightAction}
    >
      <Card style={styles.removeButton}>
        <Text style={styles.text}>Remove</Text>
      </Card>
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
    <ScrollView style={styles.container}>
      <List.Section>
        {data.map((item, index) => (
          <Swipeable
            key={index}
            renderRightActions={() => renderRightActions(item)} 
          >
            <Pressable
              style={styles.cardContainer}
              onPress={() => navigation.navigate('Account', { publicKey: item.value })}
            >
              <Card style={styles.card}>
                <List.Item title={`${item.key}: ${item.value.slice(0, 7)}...${item.value.slice(-5)}`} />
              </Card>
            </Pressable>
          </Swipeable>
        ))}
      </List.Section>
    </ScrollView>
  );
};

export default AccountList;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    width: '100%',
    height: '100%',
  },
  cardContainer: {
    flexDirection: 'row',
    margin: 3,
    gap: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    flex: 5,
  },
  rightAction: {
    backgroundColor: '#fff',
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
  },
});