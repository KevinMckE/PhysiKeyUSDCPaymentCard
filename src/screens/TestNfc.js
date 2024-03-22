

import React, { useState, useEffect } from 'react';
import { View, Button, Text } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

const TestNfc = () => {
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        // Initialize NFC manager
        NfcManager.start();

        // Set up NFC state change listeners
        NfcManager.setEventListener(NfcTech.Ndef, handleNfcDetection);

        // Clean up NFC manager on unmount
        return () => {
            NfcManager.setEventListener(NfcTech.Ndef, null);
            NfcManager.stop();
        };
    }, []);

    const handleNfcDetection = async () => {
        try {
            // Handle NFC detection
            // This function will be called when an NFC tag is detected
        } catch (error) {
            console.error('Error handling NFC detection:', error);
        }
    };

    const handleScanButtonPress = async () => {
        try {
            // Enable NFC scanning
            await NfcManager.requestTechnology(NfcTech.Ndef);
            setIsScanning(true);
        } catch (error) {
            console.error('Error requesting NFC technology:', error);
        }
    };

    const handleStopScanButtonPress = async () => {
        try {
            // Disable NFC scanning
            await NfcManager.cancelTechnologyRequest();
            setIsScanning(false);
        } catch (error) {
            console.error('Error canceling NFC technology request:', error);
        }
    };

    return (
        <View>
            {isScanning ? (
                <Button title="Stop Scan" onPress={handleStopScanButtonPress} />
            ) : (
                <Button title="Start Scan" onPress={handleScanButtonPress} />
            )}
            <Text>NFC Scanning: {isScanning ? 'Enabled' : 'Disabled'}</Text>
        </View>
    );
};
export default TestNfc;