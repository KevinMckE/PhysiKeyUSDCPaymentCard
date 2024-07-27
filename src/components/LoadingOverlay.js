/////////////////////////////////
// LOADING OVERLAY          /////
// Full page overlay           //
// When context loading is true//
// this blocks other content   //
// until loaded                //
// RegenCard 2024              //
/////////////////////////////////

import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingOverlay = ({ loading }) => {
  if (!loading) return null;
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#2E3C49" />
    </View>
  );
};

const styles = StyleSheet.create({
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
})

export default LoadingOverlay;