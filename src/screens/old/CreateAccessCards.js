import React from 'react';
import {View, StyleSheet, Modal, SafeAreaView, Image, Text, TouchableOpacity, Platform, ImageBackground, NativeModules} from 'react-native';
import {Button, IconButton, TextInput, Chip} from 'react-native-paper';
import NfcManager, {Ndef, NfcTech, makeReadOnly} from 'react-native-nfc-manager';
import {Ionicons, AntDesign, Entypo} from 'react-native-vector-icons';
import { randomBytes } from 'react-native-randombytes';

function CreateAccessCards(props) {
  const {navigation} = props;
  const [tagValue='---', setTagValue] = React.useState('');
  const [isLocked='---', setIsLocked] = React.useState('');
  const [readTagValue='---', setReadTagValue] = React.useState('');
  const [isGenerateButtonPressed, setIsGenerateButtonPressed] = React.useState(false);
  const [isWriteButtonActive, setIsWriteButtonActive] = React.useState(false);
  const [codeGeneratedText, setCodeGeneratedText] = React.useState('');
  const [clickOnCodeTextVisible, setClickOnCodeTextVisible] = React.useState(true);
  const [codeLogoImage, setCodeLogoImage] = React.useState('');
  const [modalVisible, setModalVisible] = React.useState(false);
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  async function writeNdef() {
    let scheme = '';
    const nfcInput = Ndef.uriRecord(`${scheme}${tagValue}`);
    const bytes = Ndef.encodeMessage([nfcInput]);
    //console.warn(bytes);

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      await NfcManager.ndefHandler.writeNdefMessage(bytes);
    } catch (error) {
      console.error(error);
      // bypass
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
    setReadTagValue('---');
  }

  async function readCardCode() {
    try{
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // Testing just to get the Ndef data
      const tagData = await NfcManager.ndefHandler.getNdefMessage();
      
      // turns payload into a single string of numbers with ,'s:
      const tagPayload = tagData.ndefMessage[0].payload; //isolates payload of the ndefmessage
      tagPayload.shift(); // removes the 0th index of the tagPayload so it is only the record written to the tag

      // turns the NDEF record into a string
      const ndefString = String.fromCharCode(...tagPayload);

      setReadTagValue(ndefString);

    } catch (ex) {
        //bypass
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  }

  async function lockNFC() {

        try {
    
          await NfcManager.requestTechnology(NfcTech.NfcA);
          await enablePassword();
          
        } catch (error) {
    
          console.error(error);
          
        } finally { 
          NfcManager.cancelTechnologyRequest();
          setIsLocked('Locked');
          
        }
  }

  async function unlockNFC() {

          try {
      
            await NfcManager.requestTechnology(NfcTech.NfcA);
            await disablePassword();
            
          } catch (error) {
      
            console.error(error);
            
          } finally { 
            NfcManager.cancelTechnologyRequest();
            setIsLocked('Unlocked');

          }
  }

  // code written from newline course developer Whitedogg13
  async function enablePassword() {

    const password = [0x12, 0x34, 0xab, 0xcd];
    const pack = [0xaa, 0xbb];

    let respBytes = null;
    let writeRespBytes = null;
    let authPageIdx;

    // check if this is NTAG 213 or NTAG 215
    respBytes = await NfcManager.nfcAHandler.transceive([0x30, 0]);
    const cc2 = respBytes[14];
    if (cc2 * 8 > 256) {
      authPageIdx = 131; // NTAG 215
    } else {
      authPageIdx = 41; // NTAG 213
    }

    // check if AUTH is enabled
    respBytes = await NfcManager.nfcAHandler.transceive([0x30, authPageIdx]);
    const auth = respBytes[3];

    if (auth === 255) {
      // configure the tag to support password protection
      writeRespBytes = await NfcManager.nfcAHandler.transceive([
        0xa2,
        authPageIdx + 3,
        ...pack,
        respBytes[14],
        respBytes[15],
      ]);

      writeRespBytes = await NfcManager.nfcAHandler.transceive([
        0xa2,
        authPageIdx + 2,
        ...password,
      ]);

      writeRespBytes = await NfcManager.nfcAHandler.transceive([
        0xa2,
        authPageIdx + 1,
        respBytes[4] & 0x7f,
        respBytes[5],
        respBytes[6],
        respBytes[7],
      ]);

      writeRespBytes = await NfcManager.nfcAHandler.transceive([
        0xa2,
        authPageIdx,
        respBytes[0],
        respBytes[1],
        respBytes[2],
        4,
      ]);
    } else {
      // send password to NFC tags, so we can perform write operations
      writeRespBytes = await NfcManager.nfcAHandler.transceive([
        0x1b,
        ...password,
      ]);
      if (writeRespBytes[0] !== pack[0] || writeRespBytes[1] !== pack[1]) {
        throw new Error("incorrect password");
      }
    }
  }

  async function disablePassword() {
    
      const password = [0x12, 0x34, 0xab, 0xcd];
      const pack = [0xaa, 0xbb];

      const passwordFormat = [0x00, 0x00, 0x00, 0x00];
      const packFormat = [0x00, 0x00];

      let respBytes = null;
      let writeRespBytes = null;
      let authPageIdx;

      // check if this is NTAG 213 or NTAG 215
      respBytes = await NfcManager.nfcAHandler.transceive([0x30, 0]);
      const cc2 = respBytes[14];
      if (cc2 * 8 > 256) {
        authPageIdx = 131; // NTAG 215
      } else {
        authPageIdx = 41; // NTAG 213
      } // May need to add another value if you want to enable NTAG 216 also

       // get respBytes Array and set auth 
      respBytes = await NfcManager.nfcAHandler.transceive([0x30, authPageIdx]);
      const auth = respBytes[3];

      if(auth===4){

        writeRespBytes = await NfcManager.nfcAHandler.transceive([
          0x1b,
          ...password,
        ]);
        console.warn(writeRespBytes);
        if (writeRespBytes[0] !== pack[0] || writeRespBytes[1] !== pack[1]) {
          throw new Error("incorrect password");
        }

        // disable password protection
        writeRespBytes = await NfcManager.nfcAHandler.transceive([
          0xa2,
          authPageIdx + 3,
          ...packFormat,
          respBytes[14],
          respBytes[15],
        ]);

        writeRespBytes = await NfcManager.nfcAHandler.transceive([
          0xa2,
          authPageIdx + 2,
          ...passwordFormat,
        ]);

        writeRespBytes = await NfcManager.nfcAHandler.transceive([
          0xa2,
          authPageIdx + 1,
          respBytes[4] & 0x7f, // Why does this have 0x7f? May need to look at the datasheets
          respBytes[5],
          respBytes[6],
          respBytes[7],
        ]);

        writeRespBytes = await NfcManager.nfcAHandler.transceive([
          0xa2,
          authPageIdx,
          respBytes[0],
          respBytes[1],
          respBytes[2],
          255,
        ]);

      }

  } 

  return (
      <View style={styles.wrapper}>

        <Button 
            mode="contained" 
            style={styles.grayButton} 
            onPress={() => {
              navigation.navigate('Manage Access Cards'); 
            }}>
              <Text style={styles.ManageCardText}>
                  Lock Access Cards
              </Text>
        </Button>

        <Image source={require('../assets/CardsImage.png')} style={styles.cardImage}/>
        <Text style={styles.currentCodeText}>Current Card Code</Text>
        <Text style={styles.currentCodeText2}>{tagValue}</Text>

        <View style={[styles.wrapper, styles.pad]}>

          <Button 
            mode="contained" 
            style={styles.generateCodeButton} 
            onPress={ async () => {

              // create a random value and pass it to the settagvalue
              const randVal = randomBytes(16).toString('hex');
              setTagValue(randVal); 
              
              // handle all UI changes
              setIsGenerateButtonPressed(true); 
              setIsWriteButtonActive(true);
              setCodeGeneratedText('Code Generated');
              setClickOnCodeTextVisible(false);
              setCodeLogoImage('../assets/CodeLogo.png');
              
              }
            }>
            <Text style={styles.buttonText}>
              Generate Access Code
            </Text>
            
          </Button>

          <View style={styles.graybox}>
            {clickOnCodeTextVisible && <Text style={styles.smallText}>Click on</Text>}
            {clickOnCodeTextVisible && <Text style={styles.smallText2}>Generate Access Code</Text>}

            {isGenerateButtonPressed && (
              <>
                <Image source={require('../assets/CodeLogo.png')} style={styles.codeLogoImageStyle} />
                <Text style={styles.codeGeneratedText}>{codeGeneratedText}</Text>
                <Text style={styles.displayCodeText}>{tagValue}</Text>
              </>
            )}
      
          <Button 
            mode="contained" 
            disabled={!isWriteButtonActive}
            style={[styles.writeCodeButton, { opacity: isWriteButtonActive ? 1 : 0.3 }]}
            onPress={ async () => {
              await writeNdef();
              showModal();
              }
            }>

              <Text style={[styles.buttonText,  { opacity: isWriteButtonActive ? 1 : 0.6 }]}>
                  Write Code To Card
              </Text>
              
          </Button>

          <Modal  
            visible = {modalVisible}> 

            <Button 
            mode="contained"
            style={styles.grayButtonModal}
            onPress={() => {
              hideModal();
            }}>
            <Text style={styles.ManageCardText}>
              Go Back
            </Text>
            </Button>

          <View 
            style={styles.wrapper}
            >

          <Text style={styles.codeGeneratedText}>Write Code To Backup Cards</Text>
          <Image source={require('../assets/CardsImage.png')} style={styles.cardImage}/>
          <Text style={styles.currentCodeText}>Current Card Code</Text>
          <Text style={styles.currentCodeText2}>{tagValue}</Text>
          
          <Button 
            mode="contained"
            style={styles.generateCodeButtonModal}
            onPress={() => {
              writeNdef();
            }}>
            <Text style={styles.buttonText}>
              Write Code To Backup Cards
            </Text>
            
          </Button>

          <Button 
            mode="contained"
            style={styles.grayButtonModal2}
            onPress={() => {
              navigation.navigate('Manage Access Cards'); 
              hideModal();
            }}>
            <Text style={styles.ManageCardText}>
              Lock Access Cards
            </Text>
            
          </Button>

        </View>
        </Modal>
          
        </View>
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
  },
  container: {
    flex:0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer2: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft:35,
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 1,  
  },
  cardImage: {
    height: 200,
    alignItems:'center',
    justifyContent:'center',
    marginTop: 20,
  },
  cardIconPosition: {
    marginHorizontal: 40,
  },
  box: {
    width: 415,
    height: 500,
    marginBottom: 0,
    marginTop: 40,
    backgroundColor: 'white',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#989AA0",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.09,
    shadowRadius: 1.84,
    elevation: 5,
  },
  createCardText: {
    fontSize: 20,
    textAlign:'center',
    fontWeight:'600',
    color: '#555555',
    marginTop: 30,
  },
  currentCodeText: {
    fontSize: 17,
    textAlign:'center',
    fontWeight:'500',
    color: '#747474',
    marginTop: 10,
  },
  displayCodeText:{
    fontSize: 18,
    textAlign:'center',
    fontWeight:'400',
    color: '#747474',
    marginBottom: 25,
  },
  codeGeneratedText:{
    fontSize: 20,
    textAlign:'center',
    fontWeight:'500',
    color: 'black',  
    marginTop: 5,
    marginBottom: 15,
  },
  currentCodeText2: {
    fontSize: 17,
    textAlign:'center',
    fontWeight:'400',
    color: '#C4C4C4',
    marginTop: 6,
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
  grayButton: {
    width: 220,
    height: 45,
    marginBottom:0,
    marginLeft: 130,
    marginTop: 30,
    borderRadius:10, 
    borderWidth: 1,
    backgroundColor: '#EAEAEA',
    alignItems: 'left',
    justifyContent: 'center',
  },
  grayButtonModal: {
    width: 120,
    height: 45,
    marginBottom:0,
    marginLeft: 30,
    marginTop: 70,
    borderRadius:10, 
    borderWidth: 1,
    backgroundColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grayButtonModal2: {
    width: 220,
    height: 45,
    marginBottom:0,
    marginLeft: 30,
    marginTop: 70,
    borderRadius:10, 
    borderWidth: 1,
    backgroundColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  graybox : {
    width: 340,
    height: 250,
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    paddingTop: 0,
    marginBottom:60,
    paddingBottom:0,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  generateCodeButton: {
    width: 340,
    height: 50,
    marginBottom: 30,
    borderRadius:15, 
    color: 'white',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateCodeButtonModal: {
    width: 340,
    height: 50,
    marginTop:30,
    marginBottom: 30,
    borderRadius:15, 
    color: 'white',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  writeCodeButton: {
    width: 300,
    height: 50,
    borderRadius:15, 
    color: 'white',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {                
    fontSize: 18,
    color: 'white',
    fontWeight:'400',
    fontVariant:'small',
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
      smallText:{
        fontSize: 20,
        color: '#BCBCBC',
        fontWeight:'250',
        fontVariant:'small',
        marginBottom: 0,
        paddingTop: 20,
        marginTop: 40,

      },
      smallText2:{
        fontSize: 20,
        color: '#BCBCBC',
        fontWeight:'250',
        fontVariant:'small',
        marginBottom:70,
        paddingTop: 0,

      },
      arrowPosition: {
        position: 'absolute',
        top: 60,  
        left: 15,

      },
      homeText: {
        color:'#009DFF', 
        fontSize: 20,
        paddingLeft:40,
        marginTop: 60,
      },
      ManageCardText: {
        fontSize: 16,
        color:'#7E7E7E',
        fontWeight:'400',
        fontVariant:'small',
        textAlign: 'center',
      },
      codeLogoImageStyle:{
        width: '18%',
        height: '19%',
        marginTop: 20,
      },
});

export default CreateAccessCards;





// potentially useful code:

// async function lockNFC() {

  //     try {
  
  //       await NfcManager.requestTechnology(NfcTech.Ndef);
  //       await NfcManager.ndefHandler.makeReadOnly();
        
  //     } catch (error) {
  
  //       console.error(error);
        
  //     } finally { 
  //       NfcManager.cancelTechnologyRequest();
        
  //     }
  //   }

  //  trying to use the NativeModules stuff:
  // async function lockNFC() {

  //   try {

  //     await NativeModules.NfcManager.requestTechnology([NfcTech.Ndef], (error, result) => {

  //         if (error) {
  //             console.error('Error making tag read-only:', error);
  //         } else {
  //             console.log('Tag made read-only:', result);
  //         }
  //       }) ;

  //     await NativeModules.NfcManager.makeReadOnly((error, result) => {

  //         if (error) {
  //             console.error('Error making tag read-only:', error);
  //         } else {
  //             console.log('Tag made read-only:', result);
  //         }
  //       });
      
  //   } catch (error) {

  //     console.error(error.message);
      
  //   } finally { 
  //     NativeModules.NfcManager.cancelTechnologyRequest();
      
  //   }
  // }