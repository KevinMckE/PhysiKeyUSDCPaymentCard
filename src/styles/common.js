import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // CORE 
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  center: {
    alignItems: 'center'
  },
  amountInput: {
    fontSize: 48,
    color: '#000000',
    borderWidth: 0,
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  homeButtons: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    borderTopWidth: 2,
    borderTopColor: 'rgba(23, 23, 23, 0.1)',
  },
  textContainer: {
    flexDirection: 'row',
    margin: 16,
    justifyContent: 'space-between',
  },
  card: {
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 15,
  },
  animationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },




  centeredImage: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },

  listContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 3,
  },

  button: {
    width: 250,
    margin: 10,
  },
  textMargin: {
    margin: 10,
  },

  accountText: {
    flex: 1,
    marginRight: 10, // Add some margin to create space between the text and the image
  },

  copyImage: {
    width: 24,
    height: 24,
    alignSelf: 'center',
  },

  transferButton: {
    margin: 10,
    alignItems: 'center',
  },

  confirmCard: {
    backgroundColor: '#ffffff',
    width: '100%',
  },
  MoonPay: {
    width: '100%',
    height: '100%',
  },
  mainButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    bottom: 0,
    width: '100%',
    backgroundColor: '#ffffff',
    
  },
  tabBarIcon: {
    width: 24,
    height: 24,
    padding: 16,
    resizeMode: 'contain',
  },
  inactiveTabIcon: {
    tintColor: '#909090',
    backgroundColor: '#ffffff',
  },

  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  headerButtonText: {
    fontSize: 16,
    color: '#000',
  },
  headerButtonArrow: {
    fontSize: 22,
    color: '#000',
  },
  reverifyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  reverifyText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },

  // CORE PAGE CONTAINERS
  topContainer: {
    padding: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
    padding: 10,
  },
  inputContainerKeyboard: {
    flex: 0,
  },

  bottomContainerKeyboard: {
    position: 'absolute',
    bottom: 100,
    padding: 0,
  },
  errorContainer: {
    height: 20,
  },
  errorText: {
    color: 'red',
  },
  icon: {
    marginLeft: 10,
    width: 24,
    height: 24,
  },

  // LANDING PAGE
  landingTopContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  landingBackgroundImage: {
    position: 'absolute',
    height: 650,
    opacity: 1,
  },
  landingBottomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    margin: 10,
    borderRadius: 15,
    borderColor: '#2E3C49',
    borderWidth: 1,
    color: '#2E3C49',
  },
});

export default styles;

