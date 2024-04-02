import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { Card, Title } from 'react-native-paper';

const CurrencyCard = ({ title, subtitle, imageSource }) => {
  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content style={styles.content}>
        <Image source={imageSource} style={styles.image} />
        <View>
          <Title>{title}</Title>
          <Text style={styles.amountText}>{subtitle} OP</Text>
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
  }
});

export default CurrencyCard;