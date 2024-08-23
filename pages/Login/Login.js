import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../Components/Button';
import handleToast from '../Components/Toast';
const Login = () => {
	const navigation = useNavigation();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const handleLogin = async () => {
		try {
			console.log(email, password)
			await fetch("https://1c95-2409-40e1-1009-5202-996b-5406-2bcd-36c8.ngrok-free.app/auth/login", {
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
				console.log("data during login", data);
				await AsyncStorage.setItem("jwtToken", data.token);
				handleToast('Login successful', 'green');
				navigation.navigate('ViewSurvey');
			}).catch((error) => {
				handleToast('Invalid email or password', 'red');
				console.log(error);
			});
		} catch (error) {
			handleToast('An error occurred during login. Please try again.', 'red');
			setError('An error occurred during login. Please try again.');
		}
	}
	return (
		<View style={styles.container}>
			<Text style={styles.heading}>Login</Text>
			<TextInput
				style={styles.input}
				placeholder="Email"
				onChangeText={(text) => setEmail(text)}
				value={email}
			/>
			<TextInput
				style={styles.input}
				placeholder="Password"
				secureTextEntry
				onChangeText={(text) => setPassword(text)}
				value={password}
			/>
			<Button
				textStyle={styles.buttonText}
				buttonStyle={styles.button}
				onPress={handleLogin}
			>
				<Text>Login</Text>
			</Button>
			{/* <Button title="Login" onPress={handleLogin} /> */}
			<Text style={styles.signupText}>
				Don't have an account?{' '}
				<Text style={styles.signupLink} onPress={() => navigation.navigate('Signup')}>
					Sign up
				</Text>
			</Text>
			<Text style={styles.forgotPasswordLink} onPress={() => navigation.navigate('ForgotPassword')}>
				Forgot Password?
			</Text>
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

export default Login;