import React, { useEffect } from 'react';
import {Alert, Image, View, Text, StyleSheet, TouchableOpacity, ImageBackground, Modal} from 'react-native';
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

  const [errorModal=false, setErrorModal] = React.useState();
  const showErrorModal = () => setErrorModal(true);
  const hideErrorModal = () => setErrorModal(false);

  const [pinCount, setPinCount] = React.useState(0);
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

      Scan Card Once Then Input PIN
        
      </Text>
        <View style={[styles.textInput]}>

          <Button 
          mode="contained" 
          style={[styles.scanBtn]}
          onPress={ async () => {
            await readNdef();
            finalDataChain += kdf.compute(tempDataChain, salt).toString();
            console.warn(finalDataChain);
            tempDataChain = finalDataChain;
            setTagCount(tagCount+1); // Tag input count ++
          }}>
            <Text style={styles.scanButtonText}>
              Scan Card
            </Text>
          </Button>

          <Image
            source={require('../assets/SendMoney.png')}
            style={styles.backgroundImage}>    
          </Image>

          <TextInput
            style={styles.textInput}
            placeholder="Type PIN"
            autoComplete='off'
            autoCorrect={false}
            inputValue={inputTextValue}
            onChangeText={setInputTextValues}
            autoCapitalize={false}
            backgroundColor={'white'}
            color={'black'}
            returnKeyType={'done'}
            keyboardType={'numeric'}
          />
          
          <Button 
            mode="contained" 
            style={styles.pinBtn} 
            onPress={() => {

              if(tagCount === 1 && inputTextValue !== ''){

              tempDataChain += inputTextValue;
              console.warn(tempDataChain);
              finalDataChain += kdf.compute(tempDataChain, salt).toString();
              console.warn(finalDataChain);
              tempDataChain = finalDataChain;
              showModal();
              } else {
                showErrorModal()
              }

            }
            }>
            <Text style={styles.buttonText}>
              Input PIN
            </Text>
          </Button>

        </View>

        <View style={styles.bottom}>

        <Button 
          mode="contained" 
          style={styles.bigBtn} 
          onPress={() => {
              finalDataChain = '';
              tempDataChain = '';
              setNumCount(0);
              setTagCount(0);
              setPinCount(0);
              navigation.navigate('Home');
            }
          }>
            <Text style={styles.buttonText}>
              Start Over
            </Text>
          </Button>

      <Modal  
        visible = {modalVisible}>
          <View 
            style={styles.wrapper}
            borderRadius={10}>
          <Text style={styles.bannerText} selectable>Repeat Card/PIN Input To Verify Access</Text>
          
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
              Repeat And Verify
            </Text>
            
          </Button>

          <Button 
            mode="contained"
            style={styles.bigBtn}
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

      <Modal  
          visible = {errorModal}>
            <View 
              style={styles.wrapper}
              borderRadius={10}>
            <Text style={styles.bannerText} selectable>Access Error {'\n'} {'\n'} Scan Card Once Then Input PIN</Text>

            <Button 
            mode="contained"
            style={styles.bigBtn}
            onPress={() => {
            // reset all inputValues
            finalDataChain = '';
            tempDataChain = '';
            navigation.navigate('Home');
            }}>
            <Text style={styles.easySignButtonText}>
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
    alignItems: 'center',
    padding: 2,
    marginBottom: 5,
  },
  bannerText: {
    fontSize: 30,
    textAlign: 'center',
    color: 'black',
    fontVariant: 'small-caps',
    fontWeight: 'bold',
    padding: 30,
  },
  bottom: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  scanBtn: {
    width: 300,
    height: 50,
    marginBottom: 15,
    borderRadius:15, 
    borderColor:'gray',
    color: 'black',
    borderWidth: 1,
    color: 'white',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinBtn: {
    width: 200,
    height: 50,
    marginBottom: 15,
    borderRadius:15, 
    borderColor:'gray',
    color: 'white',
    borderWidth: 1,
    color: 'black',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigBtn: {
    width: 250,
    height: 70,
    marginBottom: 15,
    borderRadius:15, 
    borderColor:'gray',
    color: 'white',
    borderWidth: 1,
    color: 'black',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: 'black',
    fontVariant: 'small',
  },
  scanButtonText: {
    fontSize: 20,
    color: 'white',
    fontVariant: 'small',
  },
  modal: {
    flex: 1,
    backgroundColor: 'green',
    margin: 50,
    padding: 40,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textContainer: {
    justifyContent: 'center',
    alignItems: 'left',
    paddingLeft: 45,
    paddingTop: 85,
    paddingBottom: 35,
  },

  textContainer2: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft:35,
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 1,  
  },
  
  box: {
    width: 350,
    height: 450,
    backgroundColor: 'white',
    borderRadius: 15,
    paddingTop: 10,
    paddingBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.09,
    shadowRadius: 1.84,
    elevation: 5,
  },

  TotalInputCountText: {
    fontSize: 20,
    textAlign:'left',
    fontWeight:'500',
    color: 'black',
    marginLeft: 35,
    marginTop: 30,
  },
  PlainText : {
    fontSize: 15,
    textAlign:'center',
    fontWeight:'300',
    color: 'gray',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 5,
    marginRight:55,
  },
  InputPlainText: {
    fontSize: 20,
//textAlign:'left',
    fontWeight:'500',
    color: '#5D6994',
    marginLeft: 35,
    marginTop: 45,


  },

  circleRed: {
    width: 14, 
    height: 14,
    backgroundColor: '#F05858',
    borderRadius: 7, 
    position: 'absolute',
    top: 155,  
    left: 35,
  },

  circleGreen: {
    width: 14, 
    height: 14,
    backgroundColor: '#83C83C',
    borderRadius: 7, 
    position: 'absolute',
    top: 155,  
    left: 140,
  },

  circleBlue: {
    width: 14, 
    height: 14,
    backgroundColor: '#304170',
    borderRadius: 7, 
    position: 'absolute',
    top: 155,  
    left: 275,
  },

  graybox : {
    width: 300,
  height: 350,
  backgroundColor: '#F4F4F4',
  borderRadius: 15,
  paddingTop: 5,
  paddingBottom: 5,
  justifyContent: 'center',
  alignItems: 'center',
  },
  

  btn: {
    width: 260,
    height: 45,
    marginBottom: 10,
    borderRadius:15, 
    
    color: 'white',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonNext: {
    width: 350,
    height: 50,
    marginTop: 30,
    borderRadius:15, 
    
    color: 'white',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },

  


    input: {
        width: 300,
        height: 45,
        borderColor: '#DFDFDF',
        borderRadius:10,
        borderWidth: 1,
        padding: 10,
        marginBottom: 20,
      },
      
      homeText: {
         fontSize: 20,
        color: '#459BF8',
        fontWeight:'500',
        fontVariant:'small',
        
        marginLeft: 50,
        marginTop: 60,

      },
  
      btnsmall: {
        width: 70,
        height: 50,
        borderRadius:15, 
        color: 'white',
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
         position: 'absolute',
        top: 3,  
        left: 238,
        
      },

      arrowPosition: {
        position: 'absolute',
        top: 16,  
        left: 262,

      },

      backgroundImage: {
        width: 250,
        height: 200,
      },

      smallText:{
        fontSize: 17,
        color: '#BCBCBC',
        fontWeight:'250',
        fontVariant:'small',
        marginBottom: 60,
        marginTop: 10,
        paddingTop: 20,
      }
});

export default AccountPortal1;



// OLD UI For Reference:

{/* <View style={styles.wrapper}>
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

      </View> */}