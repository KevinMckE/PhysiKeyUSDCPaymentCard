// libraries
import React, { useState, useContext } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { trigger } from 'react-native-haptic-feedback';
import Clipboard from '@react-native-clipboard/clipboard';
// context
import { AccountContext } from '../contexts/AccountContext';
// components
import CustomButton from '../components/CustomButton';
import TooltipComponent from '../components/ToolTip';
import Text from '../components/CustomText';
import AccountCard from '../components/AccountCard';
// styles
import styles from '../styles/common';

const ZeroFee = ({ navigation }) => {
  const { publicKey, accountName } = useContext(AccountContext);

  const [tooltipVisible, setTooltipVisible] = useState(false);

  const handleCopyToClipboard = () => {
    trigger("impactLight", { enableVibrateFallback: true, ignoreAndroidSystemSettings: false });
    Clipboard.setString(publicKey);
  };

  const onramp = () => {
    navigation.navigate('WebViewScreen', { url: 'https://regencard.app/loadcard' });
  };

  const offramp = () => {
    navigation.navigate('WebViewScreen', { url: 'https://regencard.app/cashout' });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{ flex: 2, margin: 16 }}>
          <TooltipComponent
            tooltipVisible={tooltipVisible}
            setTooltipVisible={setTooltipVisible}
            title="Use an external tool."
            text="*We recommend Coinbase"
            content="Utilizing an external tool can help avoid transfer fees.  For advanced users this is the best option."
          />
        </View>
        <Pressable onPress={handleCopyToClipboard}>
          <AccountCard
            publicKey={publicKey}
            accountName={accountName}
          />
        </Pressable>
        <View style={{ flex: 6, margin: 16 }}>
          <Text size={"medium"} color={"#000000"} text={"If you are unsure about this do not proceed. We cannot recover funds."} />
          <Text size={"medium"} color={"#000000"} text={"The following tutorials can walk you through the process with Coinbase:"} />
          <CustomButton text='Loading Card Tutorial' type='primary' size='large' onPress={onramp} style={{ marginVertical: 8 }} />
          <CustomButton text='Cashout Tutorial' type='primary' size='large' onPress={offramp} />
        </View>
      </View>
    </ScrollView>
  );
};

export default ZeroFee;
