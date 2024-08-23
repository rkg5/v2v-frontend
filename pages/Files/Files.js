import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from 'buffer';
import FileList from './FileList';
import Button from '../Components/Button';
import handleToast from '../Components/Toast';
const Files = () => {
	const postUserFiles = async (res, key) => {
		const postUserFileData = {
			fileName: res.assets[0]['name'],
			key: key,
			contentType: res.assets[0]['mimeType'],
			fileDescription: 'user file upload',
			fileCategory: ['general'],
			fileTags: ['general']
		}
		console.log("PostUserData", postUserFileData);
		try {
			const jwtToken = await AsyncStorage.getItem('jwtToken');
			const response = await fetch("http://15.206.178.11/api/upload/postUserFile", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${jwtToken}`,
				},
				body: JSON.stringify(postUserFileData),
			}).then(response => {
				if (!response.ok) {
					handleToast('Post user upload files failed', 'red');
					throw new Error('erorr', error.message)
				}
				return response.json();
			}).then(async (data) => {
				console.log(data);
				handleToast('File uploaded successfully', 'green');
			}).catch((error) => {
				handleToast('Post user upload files failed', 'red');
				console.log(error);
			});
		} catch (e) {
			console.log(e);
			handleToast('An error occurred while posting user file. Please try again later.', 'red');
		}
	}
	const uploadFile = async (uploadUrl, result, buffer, key) => {
		console.log("data recieved", uploadUrl, result);
		try {
			const res = await fetch(uploadUrl, {
				method: 'PUT',
				headers: {
					'Content-Type': result.assets[0]['mimeType'],
				},
				body: buffer,
			}).then(response => {
				if (!response.ok) {
					handleToast('File upload failed', 'red');
					throw new Error('erorr', error.message)
				}
				return response;
			}).then(async (data) => {
				console.log("uploadFile Data", data);
				await postUserFiles(result, key);
			}).catch((error) => {
				handleToast('File upload failed', 'red');
				console.log(error);
			});
		}
		catch (error) {
			console.error('Error occurred while uploading file:', error);
			handleToast('An error occurred while uploading file. Please try again later.', 'red');
		}
	}
	const pickFile = async () => {
		let result = await DocumentPicker.getDocumentAsync({
			type: '*/*',
			copyToCacheDirectory: true,
		});
		if (result.canceled) {
			return;
		}
		console.log(result);
		if (result.type === 'success') {
			setFile(result);
		}
		console.log(result.assets[0]);
		const fileEncoded = await FileSystem.readAsStringAsync(result.assets[0].uri, {
			encoding: FileSystem.EncodingType.Base64,
		});

		const buffer = Buffer.from(fileEncoded, 'base64');
		const fileData = {
			contentType: result.assets[0]['mimeType'],
			fileName: result.assets[0]['name'],
		};
		console.log("fileData", fileData);
		try {
			const jwtToken = await AsyncStorage.getItem('jwtToken');
			const response = await fetch("http://15.206.178.11/api/upload/s3Url", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${jwtToken}`,
				},
				body: JSON.stringify(fileData),
			}).then(response => {
				if (!response.ok) {
					handleToast('File upload failed', 'red');
					throw new Error('erorr', error.message)
				}
				return response.json();
			}).then(async (data) => {
				const uploadUrl = data.uploadURL;
				const getKey = data.key;
				console.log("data", data);
				await uploadFile(uploadUrl, result, buffer, getKey);
			}).catch((error) => {
				handleToast('File upload failed', 'red');
				console.log(error);
			});
		} catch (error) {
			console.error('Error occurred while uploading file:', error);
			handleToast('An error occurred while uploading file. Please try again later.', 'red');
		}
	};
	return (
		<>
			<View style={{
				alignItems: 'flex-end',
				marginRight: 20,
				marginTop: 20,
			}}>
				<Button
					onPress={pickFile}
					textStyle={styles.buttonText}
					buttonStyle={styles.button}
				>
					<Text>Upload File</Text>
				</Button>
			</View>
			<FileList />
		</>
	);
}

const styles = StyleSheet.create({
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
export default Files;
