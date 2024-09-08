/////////////////////////////////
// TRANSACTION LIST         /////
// Used on account page        //
// shows recent transactions   //
// on the give account         //
//                             //
//                             //
/////////////////////////////////

// libraries
import React from 'react';
import { StyleSheet, Text, Pressable, View, Linking } from 'react-native';
import { List, Card } from 'react-native-paper';

const TransactionList = ({ data, limit }) => {

  const openFullDetails = (hash) => {
    const url = `https://optimistic.etherscan.io/tx/${hash}`;
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  const formatDate = (string) => {
    let date = new Date(string);
    let formattedDate = new Intl.DateTimeFormat('default', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    }).format(date);
    return formattedDate;
  };

  return (
    <View style={styles.container}>
      {data.length === 0 ? (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>You have no recent activity.</Text>
        </View>
      ) : (
        <Card style={styles.card}>
          <View>
            <List.Section>
              {data.slice(0, limit).map((item, index) => (
                <Pressable
                  onPress={() => openFullDetails(item.hash)}
                  key={index}
                >
                  <View style={[styles.listItem, (index === data.length - 1 && styles.lastItem) || (limit === 3 && index === 2 && styles.lastItem)]}>
                    <List.Item
                      title={formatDate(item.age)}
                      description={`${item.hash ? item.hash.slice(0, 10) + '...' + item.hash.slice(-10) : ''}`}
                    />
                    <Text style={[styles.text, item.method === 'IN' ? styles.greenText : styles.redText]}>
                      {item.method === 'IN' ? '+' : '-'}{(Number(item.value) * Math.pow(10, 18)).toFixed(2)}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </List.Section>
          </View>
        </Card>
      )}
    </View>
  );
};

export default TransactionList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
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
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 18,
    textAlign: 'right',
    marginRight: 20,
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
    height: 50,
  },
  placeholderText: {
    fontSize: 18,
    color: '#000000',
  },
});
