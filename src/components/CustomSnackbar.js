import { View, StyleSheet } from 'react-native';
import { Snackbar, Icon, Text } from 'react-native-paper';

const CustomSnackbar = ({ visible, onDismiss, duration, text, isSuccess }) => {
  return (
    <View style={styles.container}>
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={duration}
      style={styles.snackbar}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {isSuccess ? (
          <Icon icon="check-circle" color="#ffffff" size={30} />
        ) : (
          <Icon icon="alert" color="#ffffff" size={30} />
        )}
        <Text style={{ color: '#ffffff', marginLeft: 10 }}>{text}</Text>
      </View>
    </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  snackbar: {
    backgroundColor: '#333333',
  },
});

export default CustomSnackbar;