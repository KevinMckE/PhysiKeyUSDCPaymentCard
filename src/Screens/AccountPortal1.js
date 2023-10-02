import React, { useEffect } from 'react';
import {Alert, View, Text, StyleSheet, TouchableOpacity, ImageBackground, Modal} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';
import CryptoJS from 'crypto-js';
import { useNavigation } from '@react-navigation/native';

let finalDataChain = ''; // append all inputValues to this variable
var tempDataChain = '';
var salt = 'BklcooclkncUhnaiianhUcnklcooclkB';
var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, hasher: CryptoJS.algo.SHA256, iterations: 1024 });


function AccountPortal1(props) {
  const {navigation} = props;
  
  const [inputTextValue='', setInputTextValues] = React.useState();
  const [modalVisible=false, setModalVisible] = React.useState();
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const [textCount, setTextCount] = React.useState(0);
  const [numCount, setNumCount] = React.useState(0);
  const [tagCount, setTagCount] = React.useState(0);

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

      tempDataChain += tagPayload + sum;

    } catch (ex) {
        //bypass
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.bannerText}>
        
        Input Count: 
        {'\n'}
        Text: {textCount}
        {' '}Num: {numCount}
        {' '}Tag: {tagCount}

        
      </Text>
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
              tempDataChain += inputTextValue;
              console.warn(tempDataChain);
              finalDataChain += kdf.compute(tempDataChain, salt).toString();
              console.warn(finalDataChain);
              tempDataChain = finalDataChain;
              setTextCount(textCount+1); // plain text input count ++
            }
            }>
            <Text style={styles.buttonText}>
              Raw Text Input
            </Text>
          </Button>

          <Button 
            mode="contained" 
            style={styles.smallBtn} 
            onPress={() => {
            for (let i = 0; i < inputTextValue.length; i++) {
              tempDataChain += inputTextValue.charCodeAt(i);
              tempDataChain += inputTextValue.charAt(i); 
            }
            console.warn(tempDataChain);
            finalDataChain += kdf.compute(tempDataChain, salt).toString();
            console.warn(finalDataChain);
            tempDataChain = finalDataChain;
            setNumCount(numCount+1); //Encoded input count ++
            }}>
            <Text style={styles.buttonText}>
              Encoded Input
            </Text>
          </Button>

          <Button 
          mode="contained" 
          style={[styles.smallBtn]}
          onPress={ async () => {
            await readNdef();
            finalDataChain += kdf.compute(tempDataChain, salt).toString();
            console.warn(finalDataChain);
            tempDataChain = finalDataChain;
            setTagCount(tagCount+1); // Tag input count ++
          }}>
            <Text style={styles.buttonText}>
              Input From Tag
            </Text>
          </Button>

        </View>

        <View style={styles.bottom}>

        <Button 
          mode="contained" 
          style={styles.smallBtn} 
          onPress={() => {
              console.warn(finalDataChain);
              console.warn(tempDataChain);
              // insert go to done screen to print private/public key pair;
            }
          }>
            <Text style={styles.buttonText}>
              Check Input
            </Text>
          </Button>

          <Button 
          mode="contained" 
          style={styles.smallBtn} 
          onPress={() => {
              finalDataChain = '';
              tempDataChain = '';
              setNumCount(0);
              setTagCount(0);
              setTextCount(0);
              // insert go to done screen to print private/public key pair;
            }
          }>
            <Text style={styles.buttonText}>
              Clear Input
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

        <Button 
          mode="contained" 
          style={styles.bigBtn} 
          onPress={() => {
              finalDataChain = '';
              tempDataChain = '';
              setNumCount(0);
              setTagCount(0);
              setTextCount(0);
              navigation.navigate('Home');
            }
          }>
            <Text style={styles.buttonText}>
              Home
            </Text>
          </Button>

      <Modal  
        visible = {modalVisible}>
          <View 
            style={styles.wrapper}
            borderRadius={10}>
          <Text style={styles.bannerText} selectable>Repeat Input or Start Again</Text>
          
          <Button 
            mode="contained"
            style={styles.bigBtn}
            onPress={() => {
              
              setInputTextValues('');

              const data  = finalDataChain;
              finalDataChain = '';
              tempDataChain = '';
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
            // reset all inputValues
            finalDataChain = '';
            tempDataChain = '';
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