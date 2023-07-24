import React from 'react';
import {Alert, View, Text, StyleSheet, TouchableOpacity, ImageBackground, Modal} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';
import { useNavigation } from '@react-navigation/native';

let finalDataChain = 'anywarewallet'; // append all inputValues to this variable

function AccountPortal1(props) {
  const {navigation} = props;
  
  const [inputTextValue='', setInputTextValues] = React.useState();
  const [inputTagValue='', setInputTagValues] = React.useState();
  const [modalVisible=false, setModalVisible] = React.useState();
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  //userInput();
  async function writeNdef() {
    let scheme = '';
    const nfcInput = Ndef.uriRecord(`${scheme}${inputTagValue}`);
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
      
      // turns payload into a single string of numbers with ,'s:
      const tagPayload = tagData.ndefMessage[0].payload; //isolates payload of the ndefmessage
      tagPayload.shift(); // removes the 0th index of the tagPayload so it is only the record written to the tag

      finalDataChain += tagPayload;

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
            label="Add Raw Text to Pass Phrase Input"
            autoComplete='off'
            autoCorrect={false}
            inputValue={inputTextValue}
            onChangeText={setInputTextValues}
            autoCapitalize={false}
            backgroundColor={'white'}
            color={'black'}
          />
          
          <Button 
            mode="contained" 
            style={styles.btn} 
            onPress={() => {
            finalDataChain += inputTextValue;
            }}>
            Add to Input
          </Button>

          <Button 
            mode="contained" 
            style={styles.btn} 
            onPress={() => {
            for (let i = 0; i < inputTextValue.length; i++) {
              finalDataChain += inputTextValue.charCodeAt(i);
              finalDataChain += inputTextValue.charAt(i);
            }
            }}>
            Add as Numbers to Input
          </Button>

          <TextInput
            label="Write Encoded Text to Tag"
            autoComplete='off'
            autoCorrect={false}
            inputValue={inputTagValue}
            onChangeText={setInputTagValues}
            autoCapitalize={false}
            backgroundColor={'white'}
            color={'black'}
          />

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

          if (finalDataChain.length > 53){

          showModal();

          } else {
            console.warn("Pass phrase must be minimum of 40 characters long");
          }

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
          <Text style={styles.bannerText} selectable>Repeat Input or Start Again</Text>
          
          <Button 
            mode="contained"
            style={styles.btn}
            onPress={() => {
              
              setInputTextValues('');
              setInputTagValues('');

              const data  = finalDataChain;
              finalDataChain = 'anywarewallet';
              hideModal();
              navigation.navigate('Account Portal 2', { data });
              
            }}>
            Repeat Input Check
          </Button>

          <Button 
            mode="contained"
            style={styles.btn}
            onPress={() => {
            navigation.navigate('Home');
            }}>
            Start Over
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