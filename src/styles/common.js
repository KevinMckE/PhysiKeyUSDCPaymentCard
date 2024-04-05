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
    transform: [{rotate: '-3deg'}]
  },
  landingBackgroundImageSecondary: {
    position: 'absolute',
    width: '100%',
    height: 680,
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
    width: '100%',
    height: '100%'
  },
  imageContainer: {
    alignItems: 'center',
    flex: 3,
  },
  topContainer: {
    flex: 0.5,
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
  paragraphText: {
    color: '#000000',
    fontSize: 18,
  },
  button: {
    width: 250,
    margin: 10,
  },
  headingText: {
    fontSize: 18,
    marginBottom: 25,
    color: '#000000',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  inlineButton: {
    flexDirection: 'row',
    width: 100,
    justifyContent: 'center',
    gap: 10,
  },
  errorMessage: {
    color: 'red',
    margin: 10,
  },
  bottomThirdContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
    padding: 20,
  },
  scanModalImage: {
    height: 150,
    marginBottom: 10,
  },
  textInput: {
    marginTop: 10,
    width: 250,
    height: 40,
    backgroundColor: '#ffffff',
  },
  toggleButton: {
    marginTop: 10,
  },
});

export default styles;
