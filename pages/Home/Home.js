import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../Components/Button';
import handleToast from '../Components/Toast';
const Home = () => {
	const navigation = useNavigation();
	return (
		<View style={styles.container}>
			<ImageBackground source={require('./background.gif')} resizeMode="cover" style={styles.backgroundImage}>
			<View style={styles.container}>
				<Text style={styles.title}>Vulnerability to Viability Global Partnership</Text>
				<Text style={styles.subtitle}>
					V2V is a transdisciplinary global partnership and knowledge network
					with members from Africa, Asia, Canada, and Internationally. Our aim is to
					support small-scale fishers in their transition from vulnerability to viability.
				</Text>
				<Button
					textStyle={styles.buttonText}
					buttonStyle={styles.button}
					onPress={() => handleToast('Visit https://www.v2vglobalpartnership.org/', 'green')}
				>
					<Text>Learn more</Text>
				</Button>
			</View>
			<View style={styles.signupButtonContainer}>
				<Button
					textStyle={styles.buttonText}
					buttonStyle={[styles.button, {
						paddingTop: 10,
						paddingBottom: 10,
						paddingLeft: 20,
						paddingRight: 20,
					}]}
					onPress={() => navigation.navigate('Login')}
				>
					<Text>Login</Text>
				</Button>
			</View>
			</ImageBackground>
		</View >
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	backgroundImage: {
		width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
		margin: 20,
	},
	subtitle: {
		fontSize: 16,
		textAlign: 'center',
		margin: 20,
	},
	signupButtonContainer: {
		position: 'absolute',
		top: 20,
		right: 20,
	},
	button: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 5,
		backgroundColor: 'rgb(80, 99, 301)',
		padding: 10
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		textAlign: 'center'
	},
});

export default Home;
