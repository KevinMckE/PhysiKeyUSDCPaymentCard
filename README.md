# AnyWareWallet

Each time you re-install, remember to remove GCDAsyncsocket.m from "TCP sockets" and "react-native-udp" 
in the pods > Build Phases > Compile Sources of the xcode file to avoid the duplicate symbols errors during the build phase

Website for both ANDROID AND IOS for this ^^^: https://levelup.gitconnected.com/tutorial-how-to-set-up-web3js-1-x-with-react-native-0-6x-2021-467b2e0c94a4

Resources for URL bundle issues/main.jsbundler isn't available issues:
https://stackoverflow.com/questions/57822215/main-jsbundle-file-showing-in-my-ios-project-but-still-throwing-no-bundle-url-p
https://stackoverflow.com/questions/60458933/react-native-ios-simulator-connect-to-metro-to-develop-javascript
https://stackoverflow.com/questions/57664177/error-main-jsbundle-does-not-exist-react-native-0-60-4

Generate a new main.jsbundler file with this command: react-native bundle --entry-file index.js --platform ios --dev false --bundle-output ios/main.jsbundle --assets-dest ios
