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
    transform: [{rotate: '-5deg'}]
  },
  backgroundImageSecondary: {
    position: 'absolute',
    top: 10,
    width: 335,
    height: 335,
    opacity: 1,
  },
  centeredImage: {
    width: '80%',
    height: '80%'
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 3,
  },
  listContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 3,
  },
  topContainer: {
    flex: 1,
    padding: 30,
  },
  bottomContainer: {
    flex: 3,
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  errorText: {
    margin: 10,
    padding: 10,

    color: 'red',
  },
  copyImage: {
    width: 20,
    height: 20,
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
});

export default styles;

