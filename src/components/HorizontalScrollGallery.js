import React from 'react';
import { ScrollView, StyleSheet, Image } from 'react-native';
import { Card, Paragraph } from 'react-native-paper';

const HorizontalImageGallery = ({ images }) => {
  return (
    <ScrollView horizontal style={styles.container}>
      {images.map((image, index) => (
        <Card key={index} style={styles.card}>
          <Image source={image} style={styles.image} />
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
  },
  card: {
    width: 135, 
    height: 135, 
    margin: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  image: {
    width: '100%', 
    height: '100%',
  },
});

export default HorizontalImageGallery;