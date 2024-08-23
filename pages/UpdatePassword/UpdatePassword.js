import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const UpdatePassword = () => {
	const [newPassword, setNewPassword] = useState('');
	const [confirmNewPassword, setConfirmNewPassword] = useState('');
	const [updateStatus, setUpdateStatus] = useState('');

	const handleUpdatePassword = async () => {
		try {
			if (newPassword !== confirmNewPassword) {
				setUpdateStatus('Passwords do not match. Please make sure the new passwords match.');
				return;
			}
			const response = await fetch('https://your-api-endpoint.com/update-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ newPassword }),
			});

			if (response.status === 200) {
				setUpdateStatus('Password updated successfully.');
			} else {
				setUpdateStatus('Failed to update password. Please try again.');
			}
		} catch (error) {
			console.error('Error updating password:', error);
			setUpdateStatus('An error occurred. Please try again.');
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.heading}>Update Password</Text>
			<TextInput
				style={styles.input}
				placeholder="New Password"
				secureTextEntry
				onChangeText={(text) => setNewPassword(text)}
				value={newPassword}
			/>
			<TextInput
				style={styles.input}
				placeholder="Confirm New Password"
				secureTextEntry
				onChangeText={(text) => setConfirmNewPassword(text)}
				value={confirmNewPassword}
			/>
			<Button title="Update Password" onPress={handleUpdatePassword} />
			{updateStatus ? <Text style={styles.updateStatus}>{updateStatus}</Text> : null}
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
		borderWidth: 1,
		marginBottom: 10,
		paddingLeft: 10,
	},
	updateStatus: {
		fontSize: 16,
		marginTop: 10,
		color: 'green',
	},
});

export default UpdatePassword;
