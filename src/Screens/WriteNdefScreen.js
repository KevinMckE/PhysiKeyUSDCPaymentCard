import React from 'react';
import {View, StyleSheet, SafeAreaView, Platform, ImageBackground} from 'react-native';
import {Button, TextInput, Text, Chip} from 'react-native-paper';
import NfcManager, {Ndef, NfcTech} from 'react-native-nfc-manager';

function WriteNdefScreen(props) {
  const [selectedLinkType, setSelectedLinkType] = React.useState('WEB');
  const [value, setValue] = React.useState('');

  async function writeNdef() {
    let scheme = '';
    const nfcInput = Ndef.uriRecord(`${scheme}${value}`);
    const bytes = Ndef.encodeMessage([nfcInput]);
    //console.warn(bytes);

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      await NfcManager.ndefHandler.writeNdefMessage(bytes);
    } catch (ex) {
      // bypass
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  }

  return (
    <ImageBackground source={require('../assets/AnyWareBackground.png')}
    style={styles.backgroundImage}>
      <View style={styles.wrapper}>
        <SafeAreaView />
        <View style={[styles.wrapper, styles.pad]}>

          <Text style={styles.bannerText}>
            {'\n'}Input Link Phrase{'\n'}
          </Text>

          <TextInput style={styles.textInput}
            value={value}
            onChangeText={setValue}
            autoCapitalize={false}
          />
      
          <Button 
            mode="contained" 
            style={styles.btn} 
            onPress={writeNdef}
            >
              Upload Link Phrase to Tag
          </Button>
          
        </View>
        <SafeAreaView/>
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
  backgroundImage: {
    flex: 1,
  },
  bannerText: {
    fontSize: 36,
    textAlign: 'center',
    color: 'white',
    fontVariant: 'small-caps',
    fontWeight: 'bold',
  },
  pad: {
    padding: 20,
  },
  textInput: {
    height: 400,
    width: 400,
    backgroundColor: 'white',
    opacity: .75,
    textColor: 'black',
    fontSize: 24,
    marginBottom: 40,
  },
  chip: {
    marginRight: 10,
    marginBottom: 10,
  },
  linkType: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bottom: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  btn: {
    width: 250,
    marginBottom: 15,
    justifyContent: 'center',
    color: 'black',
    backgroundColor: 'white',
  },
});

export default WriteNdefScreen;