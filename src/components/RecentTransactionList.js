import React from 'react';
import { StyleSheet, ScrollView, Text, Pressable, View, Linking } from 'react-native';
import { List, Card } from 'react-native-paper';

const TransactionList = ({ data }) => {

  const openFullDetails = (hash) => {
    const url = `https://sepolia.basescan.org/tx/${hash}`;
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  const numBlankItems = Math.max(0, 3 - data.length);
  const blankItems = Array(numBlankItems).fill(null);

  return (
    <>
      <View style={styles.textContainer}>
        <Text>Recent Activity</Text>
        <Text onPress={() => { console.log('navigate')}}>{`View all >`}</Text>
      </View>
      <Card style={styles.card}>
        <ScrollView>
          <List.Section>
            {data.slice(0, 3).map((item, index) => (
              <Pressable
                onPress={() => openFullDetails(item.hash)}
                key={index}
              >
                <View style={[styles.listItem, index === 2 && styles.lastItem]}>
                  <List.Item
                    title={`${item.hash ? item.hash.slice(0, 10) + '...' + item.hash.slice(-10) : ''}`}
                    description={`${item.age}`}
                  />
                  <Text style={[styles.text, item.method === 'IN' ? styles.greenText : styles.redText]}>
                    {item.method === 'IN' ? '+' : '-'}{Math.round(Number(item.value) * Math.pow(10, 18))}
                  </Text>
                </View>
              </Pressable>
            ))}
            {/* Render blank list items if needed */}
            {blankItems.map((_, index) => (
              <View style={styles.listItem} key={`blank_${index}`}>
                <List.Item title="..." description="..." />
              </View>
            ))}
          </List.Section>
        </ScrollView>
      </Card>
    </>
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
  textContainer: {
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 10,
    marginRight: 10,
    justifyContent: 'space-between',
  },
  greenText: {
    color: 'green',
  },
  redText: {
    color: 'red',
  },
});