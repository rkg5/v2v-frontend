import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Button from '../Components/Button';

const ForgotPassword = () => {
	const [email, setEmail] = useState('');
	const [resetStatus, setResetStatus] = useState('');

	const handleResetPassword = async () => {
		try {
			if (!email) {
				setResetStatus('Please enter your email address.');
				return;
			}

			const response = await fetch('http://15.206.178.11/api/auth/forgotPassword', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			});

			if (response.status === 200) {
				setResetStatus('Password reset link sent to ' + email);
			} else if (response.status === 404) {
				setResetStatus('Email not found. Please check the email address.');
			} else {
				setResetStatus('Failed to send reset link. Please try again.');
			}
		} catch (error) {
			console.error('Error sending reset link:', error);
			setResetStatus('An error occurred. Please try again.');
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.heading}>Forgot Password</Text>
			<Text style={styles.infoText}>Enter your email to receive a password reset link.</Text>
			<TextInput
				style={styles.input}
				placeholder="Email"
				onChangeText={(text) => setEmail(text)}
				value={email}
			/>
			<Button
				textStyle={styles.buttonText}
				buttonStyle={styles.button}
				onPress={handleResetPassword}
			>
				<Text>Email reset link</Text>
			</Button>
			{resetStatus ? <Text style={styles.resetStatus}>{resetStatus}</Text> : null}
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
	infoText: {
		fontSize: 16,
		marginBottom: 10,
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
	resetStatus: {
		fontSize: 16,
		marginTop: 10,
		color: 'green',
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

export default ForgotPassword;
