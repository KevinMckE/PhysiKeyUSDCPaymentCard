# AnyWareWallet

Each time you re-install, remember to remove GCDAsyncsocket.m from "TCP sockets" and "react-native-udp" 
in the pods > Build Phases > Compile Sources of the xcode file to avoid the duplicate symbols errors during the build phase

Resources for URL bundle issues/main.jsbundler isn't available issues:
https://stackoverflow.com/questions/57822215/main-jsbundle-file-showing-in-my-ios-project-but-still-throwing-no-bundle-url-p
https://stackoverflow.com/questions/60458933/react-native-ios-simulator-connect-to-metro-to-develop-javascript
https://stackoverflow.com/questions/57664177/error-main-jsbundle-does-not-exist-react-native-0-60-4
