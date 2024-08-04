import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // CORE 
  container: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
  },
  backgroundImage: {
    position: 'absolute',
    top: 20,
    width: 300,
    height: 300,
    opacity: 1,
  },
  centeredImage: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 3,
    marginTop: 50,
  },
  listContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 3,
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: 18,
  },
  button: {
    width: 250,
    margin: 10,
  },
  textMargin: {
    margin: 10,
  },
  card: {
    margin: 10,
    backgroundColor: '#ffffff',
  },
  keyContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  copyImage: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },

  transferButton: {
    margin: 10,
    alignItems: 'center',
  },
  textInput: {
    marginTop: 10,
    width: 250,
    height: 50,
    backgroundColor: '#ffffff',
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
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#ffffff',
    borderTopWidth: 2,
    borderTopColor: 'rgba(23, 23, 23, 0.1)',
  },
  tabBarIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  inactiveTabIcon: {
    tintColor: '#808080',
  },
  textContainer: {
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 10,
    marginRight: 10,
    justifyContent: 'space-between',
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
    paddingTop: 30,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 10,
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
  bottomContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    padding: 10,
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
});

export default styles;

