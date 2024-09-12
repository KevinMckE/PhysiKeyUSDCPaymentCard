import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import Text from './CustomText';

const AccountCard = ({ publicKey, accountName }) => {
  const truncatedKey = `${publicKey.slice(0, 7)}...${publicKey.slice(-5)}`;

  return (
    <Card style={styles.card}>
      <View style={styles.content}>
      <View>
        <View style={styles.name}>
        <Text size={"large"} color={"#000000"} text={accountName} />
        <Image
            source={require('../assets/logos/base_logo.png')}
            style={styles.icon}
          />
        </View>
          <Text size={"medium"} color={"#000000"} text={truncatedKey} />
        </View>

        <Image
          source={require('../assets/icons/copy_icon.png')}
          style={styles.icon}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 15,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    gap: 16,
  },
  name: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    width: 16,
    height: 16,
  },
});

export default AccountCard;