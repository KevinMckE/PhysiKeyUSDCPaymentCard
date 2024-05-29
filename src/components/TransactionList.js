import React from 'react';
import { StyleSheet, ScrollView, Text, Pressable, View, Image, Linking } from 'react-native';
import { List, Card } from 'react-native-paper';

const TransactionList = ({ data }) => {

  const openFullDetails = (hash) => {
    const url = `https://sepolia.basescan.org/tx/${hash}`; // Replace this with your desired URL
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  return (
    <Card style={styles.card}>
      <ScrollView style={styles.container}>
        <List.Section>
          {data.map((item, index) => (
              <Pressable
                onPress={() => openFullDetails(item.hash)}
              >
                <View style={styles.listItem}>
                  <List.Item
                    title={`${item.age}`}
                    description={`${item.hash ? item.hash.slice(0, 10) + '...' + item.hash.slice(-10) : ''}`}
                  />
                  <Text>{item.method}</Text>
                  <Text>{item.value}</Text>
                </View>
              </Pressable>
          ))}
        </List.Section>
      </ScrollView>
    </Card>
  );
};
export default TransactionList;

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
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    margin: 3,
    gap: 10,
    width: '95%',
    borderRadius: 15
  },
});