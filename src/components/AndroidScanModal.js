import React from 'react';
import { Modal, View, Image, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import CustomButton from '../components/CustomButton';

const AndroidScanModal = ({ visible, closeScanModal }) => {

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={closeScanModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.bottomThirdContainer}>
          <Text variant='titleLarge' style={styles.text}>Ready to Scan</Text>
          <Image
            source={require('../assets/icons/nfc_icon.png')}
            resizeMode="contain"
            scanModalImage
            style={styles.scanModalImage}
          />
          <Text variant='titleMedium'>Hold your device near the NFC tag.</Text>
          <CustomButton text='Cancel' type='secondary' size='small' onPress={() => { closeScanModal(); }}
          />
        </View>
      </View>
    </Modal>
  );
}

export default AndroidScanModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  text: {
    margin: 10,
  },
  bottomThirdContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
    padding: 20,
  },
  scanModalImage: {
    height: 150,
    marginBottom: 10,
  },
});