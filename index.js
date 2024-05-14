import './global.js'
import './shim.js';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { fetch as fetchPolyfill } from 'whatwg-fetch'

global.fetch = fetchPolyfill;

AppRegistry.registerComponent(appName, () => App);
