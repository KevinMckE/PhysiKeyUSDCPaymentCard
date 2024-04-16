import * as React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { List, Card } from 'react-native-paper';

const AccountList = ({ data }) => (
  
  data.length === 0 ? (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Oops! You do not have any saved accounts. Add an account to continue.</Text>
    </View>
  ) : (
    <ScrollView style={styles.container}>
      <List.Section>
        {data.map((item, index) => (
          <View key={index} style={styles.cardContainer}>
            <Card style={styles.card}>
              <List.Item title={data[0].value} style={styles.text} />
            </Card>
            <Card style={styles.removeButton}>
              <Text style={styles.text}>X</Text>
            </Card>
          </View>
        ))}
      </List.Section>
    </ScrollView>
  )
);

export default AccountList;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    width: '100%',
    height: '100%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 20,
    textAlign: 'center',
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
  removeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#de0a26',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});