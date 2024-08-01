/////////////////////////////////
// TOOL TIP                 /////
// Used as header text         //
// and is pressable to show    //
// helpful tips                //
//                             //
//                             //
/////////////////////////////////

// libraries
import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Text } from 'react-native-paper';
import Tooltip from 'react-native-walkthrough-tooltip';
// styles
import styles from '../styles/common';

const TooltipComponent = ({ tooltipVisible, setTooltipVisible, title, text, content }) => (
  <>
    <TouchableOpacity style={styles.topContainer} onPress={() => setTooltipVisible(true)}>
      <View style={styles.titleContainer}>
        <Text variant='titleLarge'>{title}</Text>
        <Image source={require('../assets/icons/info.png')} style={styles.icon} />
      </View>
      <Text variant='titleMedium'>{text}</Text>
    </TouchableOpacity>
    <Tooltip
      isVisible={tooltipVisible}
      content={<Text>{content}</Text>}
      placement="bottom"
      onClose={() => setTooltipVisible(false)}
    >
      <View />
    </Tooltip>
  </>
);

export default TooltipComponent;