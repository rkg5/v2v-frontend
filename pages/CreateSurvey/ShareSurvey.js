import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../Components/Button';
import handleToast from '../Components/Toast';
const ShareSurvey = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const handleShareSurvey = async () => {
        try {
            console.log(email, password)
            await fetch("http://15.206.178.11/api/auth/ShareSurvey", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email, password: password })
            }).then(response => {
                if (!response.ok) {
                    handleToast('Invalid email or password', 'red');
                    throw new Error('erorr', error.message)
                }
                return response.json();
            }).then(async (data) => {
                console.log("data during ShareSurvey", data);
                await AsyncStorage.setItem("jwtToken", data.token);
                handleToast('ShareSurvey successful', 'green');
                navigation.navigate('ViewSurvey');
            }).catch((error) => {
                handleToast('Invalid email or password', 'red');
                console.log(error);
            });
        } catch (error) {
            handleToast('An error occurred during ShareSurvey. Please try again.', 'red');
            setError('An error occurred during ShareSurvey. Please try again.');
        }
    }
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Add Users to this survey</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={(text) => setEmail(text)}
                value={email}
            />
            <Button
                textStyle={styles.buttonText}
                buttonStyle={styles.button}
                onPress={handleShareSurvey}
            >
                <Text>ShareSurvey</Text>
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 0.5,
        marginBottom: 10,
        borderRadius: 5,
        paddingLeft: 10,
    },
    signupText: {
        fontSize: 16,
        textAlign: 'center',
    },
    signupLink: {
        fontWeight: 'bold',
        color: 'blue',
    },
    forgotPasswordLink: {
        fontWeight: 'bold',
        color: 'blue',
        marginTop: 10,
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        backgroundColor: 'rgb(80, 99, 301)',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center'
    },
});

export default ShareSurvey;