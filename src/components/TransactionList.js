import React from 'react';
import { StyleSheet, ScrollView, Text, Pressable, View, Linking } from 'react-native';
import { List, Card } from 'react-native-paper';

const TransactionList = ({ data, limit }) => {

  const openFullDetails = (hash) => {
    const url = `https://sepolia.basescan.org/tx/${hash}`;
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  return (
    <>
      <Card style={styles.card}>
        <ScrollView>
          <List.Section>
            {data.length === 0 ? (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>Woah, no activity yet!</Text>
              </View>
            ) : (
              data.slice(0, limit).map((item, index) => (
                <Pressable
                  onPress={() => openFullDetails(item.hash)}
                  key={index}
                >
                  <View style={[styles.listItem, (index === data.length - 1 && styles.lastItem) || (limit === 3 && index === 2 && styles.lastItem)]}>
                    <List.Item
                      title={`${item.hash ? item.hash.slice(0, 10) + '...' + item.hash.slice(-10) : ''}`}
                      description={`${item.age}`}
                    />
                    <Text style={[styles.text, item.method === 'IN' ? styles.greenText : styles.redText]}>
                      {item.method === 'IN' ? '+' : '-'}{Math.round(Number(item.value) * Math.pow(10, 18))}
                    </Text>
                  </View>
                </Pressable>
              ))
            )}
          </List.Section>
        </ScrollView>
      </Card>
    </>
  );
};

export default TransactionList;

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  card: {
    margin: 10,
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 18,
    textAlign: 'right',
    paddingRight: 20,
    color: '#000000',
  },
  greenText: {
    color: 'green',
  },
  redText: {
    color: 'red',
  },
  placeholder: {
    justifyContent: 'center',
    margin: 10,
    height: 50, // Adjust the height as needed
  },
  placeholderText: {
    fontSize: 18,
    color: '#000000',
  },
});