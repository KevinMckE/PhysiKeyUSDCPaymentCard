import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ImageBackground, Modal, Image} from 'react-native';
import {Button} from 'react-native-paper';
import NfcManager from 'react-native-nfc-manager';
import Swiper from 'react-native-swiper';

function HomeScreen(props) {
    const {navigation} = props;
    const [hasNfc, setHasNfc] = React.useState(null);
    const [enabled, setEnabled] = React.useState(null);
    const [modalVisible, setModalVisible] = React.useState();
    const showModal = () => setModalVisible(true);
    const hideModal = () => setModalVisible(false);

    const swiperSlides = [
      [require('../assets/TutorialArt1.png'),'','Welcome to ','Anywhere Access'],
      [require('../assets/Logo.png'),'Create your own Web 3 access cards','Create Access Cards'],
      [require('../assets/TutorialArt3.png'),'Use these cards like a debit card \n to generate your private keys like magic','We store nothing'],
      [require('../assets/TutorialArt3.png'),'Air gapped private key storage','"Sign with Tag" functionality'],
      [require('../assets/VerificationSuccessful.png'),'Keep your key on an air gapped \n NFC tag until you are ready to tap to sign','Tap to Sign'],
      [require('../assets/TutorialArt2.png'),'Send and receive \n Bitcoin and Ethereum','Manage your digital assets'],
      [require('../assets/TutorialArt4.png'),'With Anywhere Access you can access your assets on any phone with our app installed!','Access anywhere!'],
    ];

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
        <View style={styles.buttonAlignment}>

          <Button 
          mode="contained" 
          style={[styles.filledButton]}
          onPress={() => {
            navigation.navigate('Account Portal 1');
          }}>
            <Text style={styles.buttonText1}>
                Account Portal
            </Text>
          </Button>

          <Button 
          mode="contained" 
          style={[styles.unfilledButton]}
          onPress={() => {
            navigation.navigate('Create Access Card');
          }}>
            <Text style={styles.buttonText2}>
                Create Access Cards
            </Text>
          </Button>

        </View>
      )

    }

  return (
      <View style={styles.wrapper}>
        <View style={styles.wrapper}>
          <Modal  
          visible = {modalVisible}>
              
              <Swiper
                style={styles.wrapper}
                showsButtons={false}
                showsPagination={true}
                dotColor="#1234" // Customize dot color
                activeDotColor="#364A7F" // Customize active dot color
              >
                
                {swiperSlides.map((image, index ) => (

                  <View key={index} style={styles.swiperAlignment}>  

                  <Text style={styles.titleTextBlack}>{image[2]}</Text>
                  <Text style={styles.bodyTextBlue}>{image[3]}</Text>
                  <Text style={styles.bodyTextGray}>{image[1]}</Text>
                  <Image source={image[0]} style={styles.swiperImage} resizeMode='contain'/>

                  </View>
                  
                ))}

              </Swiper>

            <View style={styles.buttonAlignment}>
              <Button 
                mode="contained" 
                style={[styles.filledButton]}
                onPress={hideModal}>
                  <Text style={styles.buttonText1}>
                      Skip
                  </Text>
              </Button>
            </View>

          </Modal>

          <View>
            <Text style={styles.titleTextBlack}>Get Started</Text>
            <Text style={styles.bodyTextGray}>Access your account {'\n'} or create your access cards</Text>
          </View>

          <ImageBackground
            source={require('../assets/HomePage.png')}
            style={styles.backgroundImage}>    
          </ImageBackground>
        </View>
        {renderNfcButtons()}
      </View>
  );
}

const styles = StyleSheet.create({
  bannerText: {
    fontSize: 40,
    textAlign: 'center',
    color: 'black',
    fontVariant: 'small-caps',
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    fontVariant: 'small-caps',
  },
  backgroundImage: {
    width: 400,
    height: 450,
  },
  bottom: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  slide: {
    backgroundColor: 'gray',
  },
  btn: {
    width: 250,
    height: 70,
    marginBottom: 15,
    color: 'white',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swiperImage: {
    width: 350,
    height: 400,
  },

  titleTextBlack: {                        
    backgroundColor: '#FFF',
    fontSize: 26,
    textAlign:'center',
    paddingTop:10,
    fontWeight:'bold',
    marginTop: 100,
  },
  bodyTextGray: {                       
    backgroundColor: '#FFF',
    fontSize: 16,
    paddingTop:20,
    paddingBottom:20,
    textAlign:'center',
    fontWeight:'400',
    color: '#8D8A8A',
    paddingLeft:20,
    paddingRight: 20,
  },

  buttonText1: {                
    fontSize: 20,
    color: 'white',
    fontWeight:'500',
    fontVariant:'small',
  },
  buttonAlignment: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingBottom: 30,
    paddingTop: 10,
  },
  filledButton: {
    width: 350,
    height: 55,
    marginBottom: 10,
    marginTop: 30,
    borderRadius:15, 
    color: 'white',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unfilledButton: {
    width: 350,
    height: 55,
    marginBottom: 0,
    borderRadius:15, 
    borderColor:'gray',
    color: 'white',
    borderWidth: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText2: {
    fontSize: 20,
    color:'gray',
    fontWeight:'500',
    fontVariant:'small',
  },
  bodyTextBlue: {                     
    backgroundColor: '#FFF',
    fontSize: 26,
    textAlign:'center',
    paddingTop:0,
    fontWeight:'bold',
    color: '#364A7F',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  buttonText: {                
    fontSize: 20,
    color: 'white',
    fontWeight:'500',
    fontVariant:'small',
  },
  buttonAlignment: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
    paddingVertical: 50,
    paddingBottom: 40,
    paddingTop: 20,
  },
  button: {
    width: 350,
    height: 55,
    marginBottom: 10,
    borderRadius:15, 
    color: 'white',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    backgroundColor: 'white',
  },
  swiperAlignment: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default HomeScreen;


//ALTERNATIVE SWIPER CODE:

// const swiperSlides = [{
//   key: '1',
//   title: '1st Slide',
//   text: 'Example Text 1',
//   image: require('../assets/Tutorial Art 1.png'),
//   backgroundColor: 'black',
// },
// {
//   key: '2',
//   title: '2nd Slide',
//   text: 'Example Text 2',
//   image: require('../assets/Tutorial Art 2.png'),
//   backgroundColor: 'black',
// },
// {
//   key: '3',
//   title: '3rd Slide',
//   text: 'Example Text 3',
//   image: require('../assets/Tutorial Art 3.png'),
//   backgroundColor: 'black',
// }];

// const renderSwiper = ({item}) => {
//   return <View>
//     <Text>{item.title}</Text>
//     <Image style={styles.wrapper} source={item.image} />
//     <Text>{item.text}</Text>
//   </View>
// };


// INSIDE THE MODAL:

{/* <AppIntroSlider
              style={styles.slide}
              data={swiperSlides}
              renderItem={renderSwiper}
              showSkipButton={true}
              showDoneButton={true}
              onDone={hideModal}
              onSkip={hideModal}
            /> */}