# AnyWareWallet

Each time you re-install, remember to remove GCDAsyncsocket.m from "TCP sockets" and "react-native-udp" 
in the pods > Build Phases > Compile Sources of the xcode file to avoid the duplicate symbols errors during the build phase
