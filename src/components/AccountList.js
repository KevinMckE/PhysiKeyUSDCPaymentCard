import React, { useState, useMemo } from 'react';
import { StyleSheet, ScrollView, View, Text, Animated, PanResponder } from 'react-native';
import { List, Card } from 'react-native-paper';

const AccountList = ({ data }) => {
  const [pan] = useState(new Animated.ValueXY());

  const panResponder = useMemo(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx < 0) { // Only allow panning to the left (negative x direction)
          Animated.event([null, { dx: pan.x }], { useNativeDriver: false })(evt, gestureState);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const threshold = -75; 
        if (gestureState.dx < threshold) {
          Animated.spring(pan, {
            toValue: { x: -150, y: 0 }, 
            useNativeDriver: false,
          }).start();
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    }), [pan]);

  return (
    <ScrollView style={styles.container}>
      <List.Section>
        {data.map((item, index) => (
          <Animated.View
            key={index}
            style={{
              ...styles.cardContainer,
              transform: [{ translateX: pan.x }],
            }}
            {...panResponder.panHandlers}
          >
            <Card style={styles.card}>
              <List.Item title={item.value} style={styles.text} />
            </Card>
            <Card style={styles.removeButton}>
              <Text style={styles.text}>Remove</Text>
            </Card>
          </Animated.View>
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
  removeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#de0a26',
    position: 'absolute',
    right: -125, // Adjust this value to change the position of the remove button
    top: 0,
    bottom: 0,
    padding: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});