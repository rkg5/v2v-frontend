import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ProfilePage = () => {
	const navigation = useNavigation();
	const [editingMode, setEditingMode] = useState(false);
	const [user, setUser] = useState({});
	const [name, setName] = useState('John Doe');
	const [email, setEmail] = useState('john.doe@example.com');
	const [phoneNumber, setPhoneNumber] = useState('123-456-7890');
	const [address, setAddress] = useState('123 Main St');
	const [college, setCollege] = useState('XYZ College');
	const [projectName, setProjectName] = useState('Awesome Project');
	const [supervisorName, setSupervisorName] = useState('Dr. Smith');
	const [profilePhotoUri, setProfilePhotoUri] = useState('https://imgs.search.brave.com/KbBaRy8tZA5ORaDygj3xB33SIEqaCbrKi68POUAT-Is/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9w/b3J0cmFpdC1oaXNw/YW5pYy1jb2xsZWdl/LXN0dWRlbnQtY2Fy/cnlpbmctYmFja3Bh/Y2stc3RhbmRpbmct/c2Nob29sLWhhbGx3/YXlfNjYyMjUxLTEx/MDkuanBnP3NpemU9/NjI2JmV4dD1qcGc');

	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const apiUrl = "http://15.206.178.11/api/getUser/profile";
				const token = await AsyncStorage.getItem('jwtToken');
				await fetch(apiUrl, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
				}).then(response => {
					return response.json();
				}).then((data) => {
					setUser(data.user);
				})
			}
			catch (error) {
				console.log(error);
			}
		}
		fetchUserProfile();
	}, []);

	const handleSave = () => {
		console.log('Details saved:', { name, email, phoneNumber, address, college, projectName, supervisorName });
		setEditingMode(false);
	};

	const handleEdit = () => {
		setEditingMode(true);
	};

	const handleImageChange = (newImage) => {
		setProfilePhotoUri(newImage);
	};

	const handleEditPicture = () => {
		navigation.navigate('ProfilePage');
	};
	const renderEditableField = (label, value, stateSetter) => {
		return (
			<View style={styles.section}>
				<Text style={styles.label}>{label}:</Text>
				{editingMode ? (
					<TextInput
						style={styles.input}
						value={value}
						onChangeText={(text) => stateSetter(text)}
					/>
				) : (
					<Text style={styles.value}>{value}</Text>
				)}
			</View>
		);
	};

	console.log("curent", user);
	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.heading}>Profile</Text>

			<View style={styles.profileContainer}>
				<Image source={{ uri: profilePhotoUri }} style={styles.profilePhoto} />
			</View>
			{/* {renderEditableField('Name', name, setName)}
			{renderEditableField('Email', email, setEmail)}
			{renderEditableField('Phone Number', phoneNumber, setPhoneNumber)}
			{renderEditableField('Address', address, setAddress)}
			{renderEditableField('College', college, setCollege)}
			{renderEditableField('Project Name', projectName, setProjectName)}
			{renderEditableField('Supervisor Name', supervisorName, setSupervisorName)} */}
			{
				user && (
					<>
						<View style={styles.section}>
							<Text style={styles.label}>Name:</Text>
							<Text style={styles.value}>{user.name}</Text>
						</View>
						<View style={styles.section}>
							<Text style={styles.label}>Email:</Text>
							<Text style={styles.value}>{user.email}</Text>
						</View>
						<View
							style={styles.section}>
							<Text style={styles.label}>Role:</Text>
							<Text style={styles.value}>{user.role}</Text>
						</View>

						<View style={styles.section}>
							<Text style={styles.label}>Joined at:</Text>
							<Text style={styles.value}>{user?.createdAt?.slice(0, 10)}</Text>
						</View>
					</>
				)
			}

			{editingMode && (
				<TouchableOpacity onPress={handleSave} style={styles.saveButton}>
					<Text>Save</Text>
				</TouchableOpacity>
			)}
			{!editingMode && (
				<TouchableOpacity onPress={handleEdit} style={styles.editButton}>
					<Text>Edit</Text>
				</TouchableOpacity>
			)}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		padding: 16,
		justifyContent: 'center',
		backgroundColor: '#f0f0f0',
	},
	profileContainer: {
		alignItems: 'center',
		marginBottom: 16,
	},
	profilePhoto: {
		width: 150,
		height: 150,
		borderRadius: 75,
	},
	heading: {
		fontSize: 30,
		fontWeight: 'bold',
		marginBottom: 16,
		textAlign: 'center',
	},
	section: {
		marginBottom: 16,
	},
	label: {
		fontSize: 18,
		marginBottom: 8,
	},
	value: {
		fontSize: 16,
		marginBottom: 8,
	},
	input: {
		height: 40,
		borderColor: 'gray',
		borderWidth: 1,
		marginBottom: 8,
		paddingHorizontal: 8,
	},
	editButton: {
		backgroundColor: '#e0e0e0',
		padding: 8,
		borderRadius: 5,
		alignItems: 'center',
		marginBottom: 16,
	},
	saveButton: {
		backgroundColor: 'green',
		padding: 8,
		borderRadius: 5,
		alignItems: 'center',
		marginTop: 8,
	},

});

export default ProfilePage;