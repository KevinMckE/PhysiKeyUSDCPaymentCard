import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ImageBackground, Modal} from 'react-native';
import {Button} from 'react-native-paper';
import NfcManager from 'react-native-nfc-manager';
import AppIntroSlider from 'react-native-app-intro-slider';

function HomeScreen(props) {
    const {navigation} = props;
    const [hasNfc, setHasNfc] = React.useState(null);
    const [enabled, setEnabled] = React.useState(null);
    const [modalVisible, setModalVisible] = React.useState();
    const showModal = () => setModalVisible(true);
    const hideModal = () => setModalVisible(false);

    const swiperSlides = [{
      key: '1',
      title: '1st Slide',
      text: 'Example Text 1',
      image: require('../assets/Tutorial Art 1.png'),
      backgroundColor: 'white',
    },
    {
      key: '2',
      title: '2nd Slide',
      text: 'Example Text 2',
      image: require('../assets/Tutorial Art 2.png'),
      backgroundColor: 'white',
    },
    {
      key: '3',
      title: '3rd Slide',
      text: 'Example Text 3',
      image: require('../assets/Tutorial Art 3.png'),
      backgroundColor: 'white',
    }];

    const renderSwiper = ({item}) => {
      return <View>
        <Text>{item.title}</Text>
        <Image source={item.image} />
        <Text>{item.text}</Text>
      </View>
    };

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
            navigation.navigate('Account Portal 1');
          }}>
            <Text style={styles.buttonText}>
                Account Portal
            </Text>
          </Button>

          <Button 
          mode="contained" 
          style={styles.btn} 
          onPress={() => {
            navigation.navigate('Raw Keys');
          }}>
            <Text style={styles.buttonText}>
                Export Keys
            </Text>
          </Button>

          <Button 
          mode="contained" 
          style={[styles.btn]}
          onPress={() => {
            navigation.navigate('Create Access Card');
          }}>
            <Text style={styles.buttonText}>
                Create Access Card
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
              
            <AppIntroSlider
              data={swiperSlides}
              renderItem={renderSwiper}
            />

          </Modal>
          <Text style={styles.bannerText}>
          AnyWare
          {'\n'}
          Access
          </Text>
        </View>
        {renderNfcButtons()}
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
  bottom: {
    paddingHorizontal: 20,
    paddingVertical: 40,
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
});

export default HomeScreen;