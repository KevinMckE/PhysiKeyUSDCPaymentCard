import React, { useState } from 'react';
import { StyleSheet, ScrollView, Text, Animated, Pressable } from 'react-native';
import { List, Card } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';

const AccountList = ({ data }) => {
  const [pan] = useState(new Animated.ValueXY());

  const renderRightActions = () => (
    <Pressable
      onPress={() => console.log('Delete item')}
      style={styles.rightAction}
    >
              <Card style={styles.removeButton}>
                <Text style={styles.text}>Remove</Text>
              </Card>
    </Pressable>
  );

  return (
    <ScrollView style={styles.container}>
      <List.Section>
        {data.map((item, index) => (
          <Swipeable
            key={index}
            renderRightActions={renderRightActions}
          >
            <Pressable
              style={styles.cardContainer}
              onPress={() => console.log('Navigate to item')}
            >
              <Card style={styles.card}>
                <List.Item title={item.value} style={styles.text} />
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