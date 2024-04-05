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
});

export default styles;
