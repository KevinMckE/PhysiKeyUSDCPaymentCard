import { View } from 'react-native';
import { Snackbar, Icon, Text } from 'react-native-paper';

const CustomSnackbar = ({ visible, onDismiss, duration, text, isSuccess }) => {
  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={duration}
      style={{ backgroundColor: '#333333' }}
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
  );
};

export default CustomSnackbar;