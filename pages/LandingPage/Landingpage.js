import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Linking  } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LandingPage = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.bottomButtons}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Weather')}
                >
                    <Text style={styles.buttonText}>Weather</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Survey')}
                >
                    <Text style={styles.buttonText}>Survey</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => Linking.openURL('https://dof.gov.in/frequently-asked-questions')}
                >
                    <Text style={styles.buttonText}>FAQs</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomButtons: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        marginVertical: 5,
        width: '80%',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LandingPage;