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
      <Text style={styles.reverifyText}>Copy your BASE Ethereum address and paste in your wallet</Text>
      <Text style={styles.reverifyText}>Be sure you send on the BASE network</Text>
      <Text style={styles.reverifyText}>If you are unsure about this, do not proceed – We cannot recover funds</Text>
        <Text selectable style={styles.reverifyText}>{publicKey}</Text>
      </View>
    </>
  );
};

export default ZeroFee;
