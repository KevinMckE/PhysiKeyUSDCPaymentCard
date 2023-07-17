import React from 'react';
import {Alert, View, Text, StyleSheet, TouchableOpacity, ImageBackground, Modal} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';
import { useNavigation } from '@react-navigation/native';

function AccountPortal1(props) {
  const {navigation} = props;

  let finalDataChain = 'anywarewallet'; // append all inputValues to this variable
  
  const [inputValue='', setInputValues] = React.useState();
  const [modalVisible=false, setModalVisible] = React.useState();
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  //userInput();
  async function writeNdef() {
    let scheme = '';
    const nfcInput = Ndef.uriRecord(`${scheme}${inputValue}`);
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

  async function readNdef() {
    try{
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // Testing just to get the Ndef data
      const tagData = await NfcManager.ndefHandler.getNdefMessage();

      //console.warn({tagData}); //print whole tag data
      //console.log(tagData.ndefMessage[0].payload); // print only payload
      
      // turns payload into a single string of numbers without ,'s:
      const tagPayload = tagData.ndefMessage[0].payload; //isolates payload of the ndefmessage
      
      tagPayload.shift(); // removes the 0th index of the tagPayload so it is only the record written to the tag
      let nfcRead = await tagPayload.join(''); // concats the string of the tagPayload into a single string of #s

      //console.warn(nfcRead); //print the information read from the tag

      finalDataChain += nfcRead;

    } catch (ex) {
        //bypass
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  }

  return (
    <ImageBackground source={require('../assets/AnyWareBackground.png')}
    style={styles.backgroundImage}>
      <View style={styles.wrapper}>
          <View style={[styles.textInput]}>

          <TextInput
            label="Add Text to Input or Tag"
            autoComplete='off'
            autoCorrect={false}
            inputValue={inputValue}
            onChangeText={setInputValues}
            backgroundColor={'white'}
            color={'black'}
          />
          
          <Button 
            mode="contained" 
            style={styles.btn} 
            onPress={() => {
            finalDataChain += inputValue;
            }}>
            Add to Input
          </Button>

          <Button 
            mode="contained" 
            style={styles.btn} 
            onPress={writeNdef}
            >
              Write to Tag
          </Button>

          <Button 
            mode="contained" 
            style={[styles.btn]}
            onPress={() => {
              readNdef();
            }}>
              Input From Tag
          </Button>
        
          <Button 
            mode="contained" 
            style={styles.btn} 
            onPress={() => {
                console.warn(finalDataChain);
                // insert go to done screen to print private/public key pair;
              }
            }>
              Check Input
          </Button>

          </View>

        <View style={styles.bottom}>
        
        <Button 
        mode="contained" 
        style={styles.btn} 
        onPress={ () => {

          showModal();

          }
        }>
          Next Step
        </Button>

      <Modal  
        visible = {modalVisible}>
          <View 
            backgroundColor={'black'}
            style={styles.wrapper}
            borderRadius={10}>
          <Text style={styles.bannerText} selectable>Repeat Input or Star Again</Text>
          
          <Button 
            mode="contained"
            style={styles.btn}
            onPress={() => {
              
              setInputValues('');

              const { data } = finalDataChain;
              hideModal();
              navigation.navigate('Account Portal 2', { data });
              
            }}>
            Repeat Input
          </Button>

          <Button 
            mode="contained"
            style={styles.btn}
            onPress={ () => {
              finalDataChain = 'anywarewallet';
              setInputValues('');
              hideModal();
            }
            }>
            Cancel & Try Again
          </Button>
          </View>
      </Modal>

      </View>

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
  textInput: {
    padding: 20,
  },
  bannerText: {
    fontSize: 42,
    textAlign: 'center',
    color: 'white',
    fontVariant: 'small-caps',
    fontWeight: 'bold',
    padding: 20,
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

export default AccountPortal1;