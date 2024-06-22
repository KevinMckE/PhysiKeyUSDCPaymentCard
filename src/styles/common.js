import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
  },
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
  topContainer: {
    padding: 30,
  },
  bottomContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: 10,
  },
  errorText: {
    color: 'red',
  },
  copyImage: {
    width: 30,
    height: 30,
  },
  transferButton: {
    margin: 10,
    alignItems: 'center',
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
    padding: 10,
  },
  textInput: {
    marginTop: 10,
    width: 300,
    height: 60,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 1.0)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
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
});

export default styles;

