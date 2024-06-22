import React, { useRef } from 'react';
import { StyleSheet, ScrollView, Text, Pressable, View, Image } from 'react-native';
import { List, Card } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';
import { removeItemFromAsyncStorage, getData } from '../functions/core/asyncStorage';

const AccountList = ({ data, navigation, setData }) => {
  const swipeableRefs = useRef([]);

  const renderRightActions = (item, index) => {
    return (
      <Pressable
        onPress={() => handleRemoveItem(item, index)}
        style={[styles.rightAction, { transform: [{ translateX: 0 }] }]}
      >
        <View style={styles.removeButton}>
          <Text style={styles.text}>Remove</Text>
        </View>
      </Pressable>
    );
  };

  const handleRemoveItem = async (item, index) => {
    try {
      await removeItemFromAsyncStorage(item.key);
      const updatedData = await getData();
      setData(updatedData);
      if (swipeableRefs.current[index]) {
        swipeableRefs.current[index].close();
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  return (
    <>
      <Card style={styles.card}>
        <ScrollView>
          <List.Section>
            {data.map((item, index) => (
              <Swipeable
                key={index}
                ref={(ref) => (swipeableRefs.current[index] = ref)}
                renderRightActions={() => renderRightActions(item, index)}
                friction={1}
                tension={50}
                rightThreshold={10}
              >
                <Pressable
                  onPress={() => navigation.navigate('Home', { label: item.key, publicKey: item.value })}
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
    </>
  );
};

export default AccountList;

const styles = StyleSheet.create({
  listItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
  },
  card: {
    margin: 10,
    backgroundColor: '#ffffff',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  rightAction: {
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100, // Set the width of the right action button
    borderRadius: 10,
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
    backgroundColor: '#de0a26',
    borderRadius: 15,
    padding: 10,
  },
  icon: {
    width: 30,
    height: 30,
  }
});
