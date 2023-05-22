import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ImageBackground} from 'react-native';
import {Button} from 'react-native-paper';
import NfcManager from 'react-native-nfc-manager';

function HomeScreen(props) {
    const {navigation} = props;
    const [hasNfc, setHasNfc] = React.useState(null);
    const [enabled, setEnabled] = React.useState(null);

    React.useEffect(() => {
        async function checkNfc() {
            const supported = await NfcManager.isSupported();
            if(supported) {
                await NfcManager.start();
                setEnabled(await NfcManager.isEnabled());
            }
            setHasNfc(supported);
        }

        checkNfc();
    }, []);

    function renderNfcButtons() {
      
      if (hasNfc === null){
        return null;
      } else if (!hasNfc) {
        return (
          <View style={styles.wrapper}>
              <Text>Your device doesn't support NFC</Text>
          </View>
        );
      } else if (!enabled){
        return (
          <View style={styles.wrapper}>
            <Text>Your NFC is not enabled!</Text>

            <TouchableOpacity
              onPress={() => {
                NfcManager.goToNfcSetting();
              }}>
              <Text>GO TO NFC SETTINGS</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                setEnabled(await NfcManager.isEnabled());
              }}>
              <Text>CHECK AGAIN</Text>
              </TouchableOpacity>
          </View>
        )

      }

      return(
        <View style={styles.bottom}>
          <Button 
          mode="contained" 
          style={[styles.btn]}
          onPress={() => {
            navigation.navigate('Account Portal');
          }}>
            Access Account
          </Button>
          <Button 
          mode="contained" 
          style={styles.btn} 
          onPress={() => {
            navigation.navigate('Create Link Phrase');
          }}>
            Create Link Phrase
          </Button>
        </View>
      )

    }

  return (
    <ImageBackground source={require('../assets/AnyWareBackground.png')}
    style={styles.wrapper}>
      <View style={styles.wrapper}>
        <View style={styles.wrapper}>
          <Text style={styles.bannerText}>
          No-Ware
          {'\n'}
          Access
          </Text>
        </View>
        {renderNfcButtons()}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    fontSize: 42,
    textAlign: 'center',
    color: 'white',
    fontVariant: 'small-caps',
    fontWeight: 'bold',
  },
  bottom: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  btn: {
    width: 250,
    marginBottom: 15,
    color: 'black',
    backgroundColor: 'white',
  },
});

export default HomeScreen;