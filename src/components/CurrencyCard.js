import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Card } from 'react-native-paper';

const CurrencyCard = ({ title, subtitle, imageSource }) => {
  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content style={styles.content}>
        <Image source={imageSource} style={styles.image} />
        <View>
          <Text variant='titleLarge'>{title}</Text>
          <Text style={styles.amountText}>{subtitle} USDC</Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  content: {
    flexDirection: 'row',
    gap: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  amountText: {
    fontSize: 30,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  }
});

export default CurrencyCard;