import React from 'react';
import {View, StyleSheet, SafeAreaView, Platform, ImageBackground, NativeModules} from 'react-native';
import {Button, TextInput, Text, Chip} from 'react-native-paper';
import NfcManager, {Ndef, NfcTech, makeReadOnly} from 'react-native-nfc-manager';
import { randomBytes } from 'react-native-randombytes';

function ManageAccessCards(props) {
  const {navigation} = props;
  const [tagValue='---', setTagValue] = React.useState('');
  const [isLocked='---', setIsLocked] = React.useState('');
  const [readTagValue='---', setReadTagValue] = React.useState('');

  const [cardOneCode, setCardOneCode] = React.useState('');
  const [cardTwoCode, setCardTwoCode] = React.useState('');

  const [showCardDetails, setShowCardDetails] = React.useState({ card1: false, card2: false });
  const [lockButtonStates, setLockButtonStates] = React.useState({ card1: false, card2: false });

  const toggleCardDetails = (card) => {
    setShowCardDetails((prevState) => ({ ...prevState, [card]: !prevState[card] }));
  };

  const toggleLockButton = (card) => {
    setLockButtonStates((prevState) => ({ ...prevState, [card]: !prevState[card] }));
  };
    
  const getLockButtonText = (card) => {
    return lockButtonStates[card] ? 'Unlock' : 'Lock';
  };
  const getBoxHeight = (card) => (showCardDetails[card] ? 360 : 100);
    
  const getViewButtonText = (card) => {
    return showCardDetails[card] ? 'View Less' : 'View Status';
  };

  async function clearInputs() {
    setCardOneCode('');
    setCardTwoCode('');
    setReadTagValue('');
    setTagValue('');
  }

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

  async function readCardOne() {
    try{
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // Testing just to get the Ndef data
      const tagData = await NfcManager.ndefHandler.getNdefMessage();
      
      // turns payload into a single string of numbers with ,'s:
      const tagPayload = tagData.ndefMessage[0].payload; //isolates payload of the ndefmessage
      tagPayload.shift(); // removes the 0th index of the tagPayload so it is only the record written to the tag

      // turns the NDEF record into a string
      const ndefString = String.fromCharCode(...tagPayload);

      setCardOneCode(ndefString);

    } catch (ex) {
        //bypass
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  }

  async function readCardTwo() {
    try{
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // Testing just to get the Ndef data
      const tagData = await NfcManager.ndefHandler.getNdefMessage();
      
      // turns payload into a single string of numbers with ,'s:
      const tagPayload = tagData.ndefMessage[0].payload; //isolates payload of the ndefmessage
      tagPayload.shift(); // removes the 0th index of the tagPayload so it is only the record written to the tag

      // turns the NDEF record into a string
      const ndefString = String.fromCharCode(...tagPayload);

      setCardTwoCode(ndefString);

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
      <View>

        <Text style={styles.cardStatusText}>Manage Cards</Text>
         
         <View style={styles.container}>
         
         <View style={[styles.box, { height: getBoxHeight('card1') }]}>
           <View style={styles.circleBlue}></View>
           <Text style={styles.cardTitleText}>Card 1</Text> 
           <Text style={styles.statusText}>Status: </Text>
       
           <Button 
              style={styles.grayButton} 
              onPress={() => toggleCardDetails('card1')}>
                <Text style={styles.viewCodeText}>
                 {getViewButtonText('card1')}
                </Text>
           </Button>
   
           {showCardDetails.card1 && (
              
                 <View style={styles.graybox}>

                  <Button 
                      mode="contained" 
                      style={styles.readButton} 
                      onPress={async() => {  
                        await readCardOne();
                      }}>
                    <Text style={styles.lockButtonText}>
                      Read
                    </Text>
                  </Button>

                  <Button 
                      mode="contained" 
                      style={styles.lockButton} 
                      onPress={async () => {  
                        if(getLockButtonText('card1')==='Lock'){
                        await lockNFC();
                      } else {
                        await unlockNFC();
                      }
                      toggleLockButton('card1');
                      }}>
                    <Text style={styles.lockButtonText}>
                      {getLockButtonText('card1')}
                    </Text>
                  </Button>

                   <Text style={styles.cardTitleText}>Access Code: </Text>
                   <Text style={styles.codeText}>{cardOneCode}</Text>

                 </View> 
              
             )}
             <View style={styles.horizontalLine} />
           </View>
           
           <View style={[styles.box2, { height: getBoxHeight('card2') }]}>
           <View style={styles.circleRed}></View>
           <Text style={styles.cardTitleText}>Card 2</Text> 
           <Text style={styles.statusText}>Status: </Text>
           <Button 
               style={styles.grayButton} 
               onPress={() => toggleCardDetails('card2')}>
                 <Text style={styles.viewCodeText}>
                 {getViewButtonText('card2')}
                 </Text>
           </Button>
   
           {showCardDetails.card2 && (
              
                <View style={styles.graybox}>

                <Button 
                      mode="contained" 
                      style={styles.readButton} 
                      onPress={async() => {  
                        await readCardTwo();
                      }}>
                    <Text style={styles.lockButtonText}>
                      Read
                    </Text>
                  </Button>

                <Button 
                  mode="contained" 
                  style={styles.lockButton} 
                  onPress={async () => {  
                      if(getLockButtonText('card2')==='Lock'){
                        await lockNFC();
                      } else {
                        await unlockNFC();
                      }
                      toggleLockButton('card2');
                  }}>
                  <Text style={styles.lockButtonText}>
                  {getLockButtonText('card2')}
                  </Text>
                </Button>
   
                <Text style={styles.cardTitleText}>Access Code: </Text>
                <Text style={styles.codeText}>{cardTwoCode}</Text>

                </View> 
              
             )}
           
          </View>

          <Button 
            mode="contained"
            style={styles.smallBtn}
            onPress={() => {
              clearInputs();
            }}>
            <Text style={styles.ManageCardText}>
              Clear All Inputs
            </Text>
          </Button>

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
    marginTop: 30,
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

  watermarkAlignment: {
    width: 250,
    height: 200,
    alignItems:'center',
    justifyContent:'center',
    marginTop: 70,
    marginLeft: 0,
  },

  

  box: {
    width: 350,
    height: 180,
    marginBottom: 0,
    marginTop: 15,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingTop: 35,
    paddingLeft: 20,
    paddingRight: 20,
    //justifyContent: 'center',
    //alignItems: 'center',
    shadowColor: "#989AA0",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.04,
    shadowRadius: 1.84,
    elevation: 5,
  },

  horizontalLine: {
    height: 1, 
    backgroundColor: '#EBEBEB', 
    marginTop: 0, 
    marginBottom: 0, 
  },

 
  box2: {
    width: 350,
    height: 180,
    marginBottom: 0,
    marginTop: 0,
    backgroundColor: 'white',
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    paddingTop: 35,
    paddingLeft: 20,
    paddingRight: 20,
    //justifyContent: 'center',
    //alignItems: 'center',
    shadowColor: "#989AA0",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.04,
    shadowRadius: 1.84,
    elevation: 5,
  },

  
cardStatusText: {
    fontSize: 21,
//textAlign:'left',
    fontWeight:'500',
    color: '#5D6994',
    marginLeft: 35,
    marginTop: 25,


  },

  cardTitleText: {
    fontSize: 19,
    fontWeight:'500',
    color: '#363636',
    marginTop: -17,
    marginBottom: 2,
    marginLeft: 17,
  },

  cardDetails: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },

  grayButton: {
    width: 130,
    height: 45,
    marginBottom:0,
    marginLeft: 180,
    marginTop:-65,
    borderRadius:10, 
    borderWidth: 1,
    backgroundColor: '#EAEAEA',
     alignItems: 'center',
     justifyContent: 'center',
  },
  lockButton: {
    width: 120,
    height: 40,
    marginBottom: 30,
    marginTop: 0,
    borderRadius:15, 
    borderColor:'#ACA9A9',
    color: 'white',
    borderWidth: 1,
    backgroundColor: 'Black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  readButton: {
    width: 120,
    height: 40,
    marginBottom: 20,
    marginTop: 20,
    borderRadius:15, 
    borderColor:'#ACA9A9',
    color: 'white',
    borderWidth: 1,
    backgroundColor: 'Black',
    alignItems: 'center',
    justifyContent: 'center',
  },

  graybox : {
    width: 310,
  height: 210,
  backgroundColor: '#F0F0F0',
  borderRadius: 15,
  paddingTop: 0,
  marginBottom:10,
  marginTop:30,
  paddingBottom:0,
 alignItems: 'center',
 justifyContent:'flex-start',
  paddingHorizontal: 55,
  },
  
  circleRed: {
    width: 10, 
    height: 10,
    backgroundColor: '#F05858',
    borderRadius: 5, 

  },
  
  circleBlue: {
    width: 10, 
    height: 10,
    backgroundColor: '#2F97FF',
    borderRadius: 5, 
  },

      arrowPosition: {
        position: 'absolute',
        top: 60,  
        left: 15,

      },
      lockButtonText:{
        color:'#ACA9A9', 
        fontSize: 18,
        fontWeight:'400',
    
      },

      backText: {
        color:'#009DFF', 
        fontSize: 20,
        paddingLeft:40,
        marginTop: 60,
      },

      viewCodeText: {
        fontSize: 17,
        color:'#7E7E7E',
        fontWeight:'500',
        fontVariant:'small',
      },

      
      codeText:{

        color:'#909090', 
        fontSize: 17,
        textAlign: 'center'
       
      },

      statusText: {
        fontSize: 17,
        color:'#B2B2B2',
        fontWeight:'400',
        fontVariant:'small',
        marginBottom: 15,
        marginLeft: 17,

      },

      horizontalLine: {
        height: 1, 
        backgroundColor: '#EBEBEB', 
        marginTop: 30, 
        marginBottom: 30, 
      },
});

export default ManageAccessCards;





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