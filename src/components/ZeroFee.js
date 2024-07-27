// libraries
import React, {useContext} from 'react';
import styles from '../styles/common';
import { View, Text } from 'react-native';
// context
import { AccountContext } from '../contexts/AccountContext';

const ZeroFee = () => {

  const { publicKey } = useContext(AccountContext);
  return (
    <>
      <View style={styles.reverifyContainer}>
        <Text style={styles.reverifyText}>{publicKey}</Text>
      </View>
    </>
  );
};

export default ZeroFee;
