import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, LogBox } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import NetInfo from "@react-native-community/netinfo";
import Button from '../Components/Button';
// import handleToast from '../Components/Toast';

const CreateSurvey = ({ navigation }) => {
	const { params } = useRoute();
	const { surveyList, data, setSurveyList } = params;
	// const netInfo = NetInfo.fetch();
	// console.log(netInfo)
	const [formData, setformData] = useState([]);
	const [formResponses, setFormResponses] = useState({});
	const [selectedChoice, setSelectedChoice] = useState({});
	const [checkedItems, setCheckedItems] = useState({});
	const [currCategory, setCurrCategory] = useState(0);
	LogBox.ignoreLogs([
		'Non-serializable values were found in the navigation state',
	]);
	console.log("Form Responses: ", formResponses)
	const handleSubmit = async (formResponses) => {
		// console.log("Form Responses: ", formResponses)
		// console.log(netInfo.isConnected)
		// if (netInfo.isConnected) {
		// 	handleToast('Connected to internet', 'green');
		// }
		// else {
		// 	console.log("No internet")
		// 	handleToast('No internet', 'red');
		// }
		// if (!netInfo.isConnected) {
		// 	storedData = {
		// 		id: data._id,
		// 		answers: formResponses,
		// 		uploaded: false
		// 	}
		// 	await AsyncStorage.setItem('offlineData', [storedData]);
		// }
		// else {
		try {
			let answers = []
			for (const val in formResponses) {
				if (formResponses[val] instanceof Array) {
					answers.push({
						questionId: val,
						answerArray: formResponses[val]
					})
				}
				else {
					answers.push({
						questionId: val,
						answerString: formResponses[val]
					})
				}
			}
			console.log("Answers: ", answers)
			const token = await AsyncStorage.getItem('jwtToken')
			await fetch(`http://15.206.178.11/api/survey/response/${data._id}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({
					answers
				}),
			}).then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error status::${response.status}`);
				}
				alert('Form submitted successfully');
				console.log("Submitted Response: ", response)
				setFormResponses({});
				setCheckedItems({});
				setSelectedChoice({});
				navigation.navigate("Survey")
				return response.json();
			});
		} catch (error) {
			console.error('Error occurred during form submission:', error);
			alert('An error occurred during form submission. Please try again later.');
		}
		// }
	};


	useEffect(() => {
		const fetchData = async () => {
			try {
				const apiUrl = `http://15.206.178.11/api/survey/${data._id}`;
				const token = await AsyncStorage.getItem('jwtToken');
				await fetch(apiUrl, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
				}).then(response => {
					return response.json();
				}).then((res) => {
					console.log("Perticular survey: ", res);
					setformData(res.questions);
				})
			}
			catch (error) {
				console.log(error);
			}
		}
		fetchData();
	}, []);


	const handleDelete = async (data) => {
		console.log("Deleted Survey: ", data)
		try {
			const apiUrl = `http://15.206.178.11/api/survey/${data._id}`;
			const token = await AsyncStorage.getItem('jwtToken');
			await fetch(apiUrl, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
			}).then(response => {
				return response.json();
			}).then((res) => {
				// alert('Survey deleted');
				console.log("Deleted Response: ", res)
				const newSurveyList = surveyList.filter((survey) => survey._id !== data._id);
				setSurveyList(newSurveyList);
				navigation.navigate("Survey",)
			})
		}
		catch (error) {
			console.log(error);
		}
	}

	const handleTextChange = (question, value) => {
		formResponses[question._id] = value;
		setFormResponses({ ...formResponses });
	};
	const handleChoiceChange = (question, choice) => {
		selectedChoice[question._id] = choice;
		formResponses[question._id] = choice;
		setFormResponses({ ...formResponses });
	};

	const handleCheckboxChange = (i, choice) => {
		const selectedChoices = formResponses[i._id] || [];
		if (formResponses[i._id] && formResponses[i._id].includes(choice)) {
			formResponses[i._id] = formResponses[i._id].filter((c) => c !== choice);
		}
		else {
			formResponses[i._id] = [...selectedChoices, choice];
		}
		setCheckedItems(formResponses[i._id] || []);
		setFormResponses(formResponses);
	};

	function toSentenceCase(str) {
		return str.toLowerCase().charAt(0).toUpperCase() + str.slice(1);
	}

	const renderForm = () => {
		// return formData.map((i) => {
		// console.log("checkmate", i);
		return (
			<View key={formData[currCategory]?.category._id}
				style={styles.cateContainer}
			>
				<Text style={{
					fontSize: 16,
					marginBottom: 20,
					textTransform: 'uppercase',
					fontWeight: 'bold',
					color: 'green'

				}}>{formData[currCategory]?.category.title}</Text>
				{
					formData[currCategory]?.questions.map((j) => {
						// console.log("Question Type: ", j)
						if (j.type == "text") {
							return (
								<View key={j._id} style={{ marginBottom: 20 }}>
									<Text style={styles.questionText}>{j.questionString}</Text>
									<TextInput
										style={{ borderWidth: 0.5, padding: 8, marginBottom: 10, borderRadius: 5 }}
										onChangeText={(text) => handleTextChange(j, text)}
										value={formResponses[j._id]}
										placeholder={`Enter ${j.type}`}
									/>
								</View>
							);

						}
						if (j.type == "multipleChoice") {
							return (
								<View key={j._id} style={{ marginBottom: 20 }}>
									<Text style={styles.questionText}>{j.questionString}</Text>
									{j.options.map((options, index) => (
										<TouchableOpacity key={index} onPress={() => handleChoiceChange(j, options)}>
											<View style={styles.choiceContainer}>
												<View style={[{ borderColor: selectedChoice[j._id] === options ? 'green' : 'gray' }, styles.multipleChoice]}>
													{selectedChoice[j._id] === options && <View style={styles.multipleChoiceDot} />}
												</View>
												<Text
													style={[{
														color: selectedChoice[j._id] === options ? 'green' : 'black',
														marginLeft: 10,
													}, styles.optionText]}>{options}</Text>
											</View>
										</TouchableOpacity>
									))}
								</View>
							);
						}

						if (j.type == "checkbox") {
							return (
								<View key={j._id} style={{ marginBottom: 20 }}>
									<Text style={styles.questionText}>{j.questionString}</Text>
									{j.options.map((choice, index) => (
										<View key={index} style={styles.choiceContainer}>
											<TouchableOpacity
												onPress={() => handleCheckboxChange(j, choice)}>
												<View style={styles.choiceContainer}>
													<View style={[{ borderColor: formResponses[j._id] && formResponses[j._id].includes(choice) ? 'green' : 'gray', }, styles.checkBox]}>
														{formResponses[j._id] && formResponses[j._id].includes(choice) && <View style={styles.checkBoxDots} />}
													</View>
													<Text style={[{
														color: formResponses[j._id] && formResponses[j._id].includes(choice) ? 'green' : 'black',
														marginLeft: 10,
													}, styles.optionText]}>{choice}</Text>
												</View>
											</TouchableOpacity>
										</View>
									))}
								</View>
							)
						}
					})
				}
			</View>
		)
		// })
	}
	return (
		<View>
			<ScrollView style={{ padding: 20 }}>
				<Text style={{ fontSize: 24, marginBottom: 20 }}>{data.title}</Text>
				<Text style={{ fontSize: 16, marginBottom: 20 }}>{data.description}</Text>
				<View style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					marginBottom: 20,
				}}>
					<TouchableOpacity onPress={() => handleDelete(data)}>
						<Text style={{ color: 'red' }}>Delete Survey</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => navigation.navigate("ShareSurvey")}>
						<Text style={{ color: 'green' }}>Share Survey </Text>
					</TouchableOpacity>
					<Text>{toSentenceCase(data.visibility)}</Text>
				</View>
				{renderForm()}
				<TouchableOpacity TouchableOpacity onPress={() => handleSubmit(formResponses)} style={{ marginTop: 20, padding: 10, backgroundColor: 'green', alignItems: 'center', borderRadius: 5 }}>
					<Text style={{ fontSize: 16, color: 'white' }}>Submit Form</Text>
				</TouchableOpacity>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						marginTop: 20,
						marginBottom: 40
					}}
				>
					<Button
						textStyle={styles.buttonText}
						buttonStyle={styles.button}
						onPress={() => {
							if (currCategory > 0) {
								setCurrCategory(currCategory - 1);
							}
						}}
					>
						<Text>Back</Text>
					</Button>

					<Button
						textStyle={styles.buttonText}
						buttonStyle={styles.button}
						onPress={() => {
							if (currCategory < formData.length - 1) {
								setCurrCategory(currCategory + 1);
							}
						}}
					>
						<Text>Next</Text>
					</Button>
				</View>
			</ScrollView>
		</View >
	);
};

const styles = {
	questionText: {
		fontSize: 20,
		marginBottom: 10,
	},
	optionText: {
		fontSize: 16,
	},
	choiceContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 5
	},
	multipleChoice: {
		width: 16,
		height: 16,
		borderRadius: 8,
		borderWidth: 0.5,
		justifyContent: 'center',
		alignItems: 'center'
	},
	multipleChoiceDot: {
		width: 8,
		height: 8,
		backgroundColor: 'green',
		borderRadius: 6
	},
	checkBox: {
		width: 16,
		height: 16,
		borderRadius: 2,
		borderWidth: 0.5,
		justifyContent: 'center',
		alignItems: 'center'
	},
	checkBoxDots: {
		width: 8,
		height: 8,
		backgroundColor: 'green',
		borderRadius: 2
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
	cateContainer: {
		backgroundColor: 'white',
		padding: 20,
		borderRadius: 5,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		marginBottom: 20
	}
};
export default CreateSurvey;