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

const TooltipComponent = ({ tooltipVisible, setTooltipVisible, title, content }) => (
  <>
    <TouchableOpacity style={styles.topContainer} onPress={() => setTooltipVisible(true)}>
      <Text variant='titleLarge'>{title}</Text>
      <Image source={require('../assets/icons/info.png')} style={styles.icon} />
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