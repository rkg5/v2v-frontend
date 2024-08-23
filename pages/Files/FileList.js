import React, { useState, useEffect } from 'react'
import { View, FlatList, Text, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import handleToast from '../Components/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AntDesign } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as WebBrowser from 'expo-web-browser';
const FileList = () => {
	const [files, setFiles] = useState([])
	useEffect(() => {
		const fetchFiles = async () => {
			try {
				const jwtToken = await AsyncStorage.getItem('jwtToken');
				const response = await fetch("http://15.206.178.11/api/upload/getFiles", {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${jwtToken}`,
					},
				});

				if (response.ok) {
					const data = await response.json();
					console.log(data.data);
					setFiles(data.data);
					handleToast('Files fetched successfully', 'green');
				} else {
					const data = await response.json();
					handleToast(`Failed to get Files: ${data.message}`, 'red');
				}
			} catch (error) {
				console.error('Error occurred while getting file:', error);
				handleToast('An error occurred while getting file. Please try again later.', 'red');
			}
		}
		fetchFiles();
	}, []);
	const downloadFile = async (url, fileName) => {
		try {
			const { type } = await WebBrowser.openBrowserAsync(url);
			if (type === 'dismiss') {
				console.log('User dismissed the browser before download');
				return;
			}
			const downloadPath = FileSystem.documentDirectory + fileName;
			await FileSystem.downloadAsync(url, downloadPath);
			console.log('File downloaded successfully to:', downloadPath);
		} catch (error) {
			console.error('Error downloading file:', error);
			handleToast('An error occurred while downloading file. Please try again later.', 'red');
		}
	}
	const handleView = async (item) => {
		try {
			const jwtToken = await AsyncStorage.getItem('jwtToken');
			const response = await fetch("http://15.206.178.11/api/upload/objectUrl", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${jwtToken}`,
				},
				body: JSON.stringify({ key: item.key }),
			});
			if (response.ok) {
				const data = await response.json();
				const url = data['Object access URL'];
				console.log(url);
				await downloadFile(url, item.fileName);
			} else {
				const data = await response.json();
				handleToast(`Failed to get file: ${data.message}`, 'red');
			}
		} catch (error) {
			console.error('Error occurred while downloading file:', error);
			handleToast('An error occurred while downloading file. Please try again later.', 'red');
		}
	}
	return (
		<View style={{ flex: 1 }}>
			<FlatList
				data={files}
				keyExtractor={(item) => item.key}
				renderItem={({ item }) => {
					return (
						<View style={{
							flexDirection: 'row',
							backgroundColor: 'white',
							borderRadius: 8,
							elevation: 4,
							marginHorizontal: 16,
							marginVertical: 8,
							padding: 16,
							justifyContent: 'space-between',
						}}>
							<Text style={{
								fontSize: 16,
								fontWeight: 'bold',
								color: 'black',

							}}>{item.fileName}</Text>

							<TouchableOpacity onPress={() => handleView(item)}>
								<AntDesign name="download" size={16} color="black" />
							</TouchableOpacity>
						</View>
					)
				}}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	button: {
		justifyContent: 'center',
		borderRadius: 5,
		backgroundColor: 'rgb(80, 99, 301)',
		marginLeft: 10,
		paddingLeft: 10,
		paddingRight: 10,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		textAlign: 'center'
	},
})
export default FileList