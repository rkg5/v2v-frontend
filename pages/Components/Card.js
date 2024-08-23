import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Card = ({ data }) => {
  const { title, description } = data;

  return (
    <View style={styles.card}>
      <Text>Title: {title}</Text>
      <Text>Description: {description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 4,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
  },
});

export default Card;
