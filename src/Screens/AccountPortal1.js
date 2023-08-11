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

      const sum = tagPayload.reduce((acc, curr) => acc + curr, 0);

      finalDataChain += tagPayload + sum;

    } catch (ex) {
        //bypass
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  }

  return (
    <View style={styles.wrapper}>
        <View style={[styles.textInput]}>

          <TextInput
            style={styles.textInput}
            label="Add Text to Input"
            autoComplete='off'
            autoCorrect={false}
            inputValue={inputTextValue}
            onChangeText={setInputTextValues}
            autoCapitalize={false}
            backgroundColor={'grey'}
            color={'white'}
            returnKeyType={'done'}
          />
          
          <Button 
            mode="contained" 
            style={styles.smallBtn} 
            onPress={() => {
            finalDataChain += inputTextValue;
            }}>
            <Text style={styles.buttonText}>
              Raw Text Input
            </Text>
          </Button>

          <Button 
            mode="contained" 
            style={styles.smallBtn} 
            onPress={() => {
            for (let i = 0; i < inputTextValue.length; i++) {
              finalDataChain += inputTextValue.charCodeAt(i);
              finalDataChain += inputTextValue.charAt(i);
            }
            }}>
            <Text style={styles.buttonText}>
              Encoded Input
            </Text>
          </Button>

          <TextInput
            style={styles.textInput}
            label="Add Text to Tag"
            autoComplete='off'
            autoCorrect={false}
            inputValue={inputTagValue}
            onChangeText={setInputTagValues}
            autoCapitalize={false}
            backgroundColor={'grey'}
            color={'white'}
            returnKeyType={'done'}
          />

          <Button 
            mode="contained" 
            style={styles.smallBtn} 
            onPress={writeNdef}
            >
            <Text style={styles.buttonText}>
              Write To Tag
            </Text>
          </Button>

          <Button 
          mode="contained" 
          style={[styles.smallBtn]}
          onPress={() => {
            readNdef();
          }}>
            <Text style={styles.buttonText}>
              Input From Tag
            </Text>
          </Button>

        </View>

        <View style={styles.bottom}>

        <Button 
          mode="contained" 
          style={styles.bigBtn} 
          onPress={() => {
              console.warn(finalDataChain);
              // insert go to done screen to print private/public key pair;
            }
          }>
            <Text style={styles.buttonText}>
              Check Input
            </Text>
          </Button>
        
        <Button 
        mode="contained" 
        style={styles.bigBtn} 
        onPress={ () => {

          if (finalDataChain.length > 53){

          showModal();

          } else {
            console.warn("Pass phrase must be minimum of 40 characters long");
          }

          }
        }>
            <Text style={styles.buttonText}>
              Next Step
            </Text>
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
            style={styles.bigBtn}
            onPress={() => {
              
              setInputTextValues('');
              setInputTagValues('');

              const data  = finalDataChain;
              finalDataChain = 'anywarewallet';
              hideModal();
              navigation.navigate('Account Portal 2', { data });
              
            }}>
            <Text style={styles.buttonText}>
              Repeat Input Check
            </Text>
            
          </Button>

          <Button 
            mode="contained"
            style={styles.smallBtn}
            onPress={() => {
            navigation.navigate('Home');
            }}>
            <Text style={styles.buttonText}>
              Start Over
            </Text>
            
          </Button>
        </View>
      </Modal>

      </View>

      </View>
    );

}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  textInput: {
    paddingHorizontal: 20,
  },
  bannerText: {
    fontSize: 20,
    textAlign: 'center',
    color: 'black',
    fontVariant: 'small-caps',
    fontWeight: 'bold',
    padding: 20,
  },
  bottom: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  smallBtn: {
    width: 200,
    height: 50,
    marginBottom: 15,
    color: 'white',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigBtn: {
    width: 250,
    height: 70,
    marginBottom: 15,
    color: 'white',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    fontVariant: 'small-caps',
  },
  modal: {
    flex: 1,
    backgroundColor: 'green',
    margin: 50,
    padding: 40,
    borderRadius: 10,
  }
});

export default AccountPortal1;