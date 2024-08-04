// libraries
import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Tooltip from 'react-native-walkthrough-tooltip';

const TooltipComponent = ({ tooltipVisible, setTooltipVisible, title, text, content }) => (
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
    <Text style={styles.textItem}>{text}</Text>
  </>
);

const styles = StyleSheet.create({
  topContainer: {
    paddingTop: 30,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textItem: {
    alignSelf: 'flex-start', // Align textItem to the left
    marginLeft: 50, 
  },
  icon: {
    marginLeft: 10,
    width: 24,
    height: 24,
  },
});

export default TooltipComponent;
