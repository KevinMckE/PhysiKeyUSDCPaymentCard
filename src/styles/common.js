import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    height: 650,
    opacity: 1,
    transform: [{rotate: '-3deg'}]
  },
  backgroundImageSecondary: {
    position: 'absolute',
    width: '100%',
    height: 680,
    opacity: 1,
  },
  centeredImage: {
    width: '85%',
    height: '85%'
  },
  bottomContainer: {
    flex: 1,
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
  }
});

export default styles;
