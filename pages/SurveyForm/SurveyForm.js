import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import handleToast from '../Components/Toast';
const DynamicForm = () => {
	console.log("my form is rendering");
	const navigation = useNavigation();
	const [surveyTitle, setSurveyTitle] = useState('');
	const [surveyDescription, setSurveyDescription] = useState('');
	const [visibility, setVisibility] = useState('public');
	const key = 1;
	const [formFields, setFormFields] = useState(
		[
			{
				[key]: [
					{
						id: 1,
						type: 'text',
						questionString: '',
						options: [],
					},
				],
			},
		]
	);
	// console.log(formFields);

	 // Key for AsyncStorage
	 const STORAGE_KEY = '@survey_form';

	 useEffect(() => {
        const loadFormData = async () => {
            try {
                const savedFormData = await AsyncStorage.getItem(STORAGE_KEY);
                if (savedFormData !== null) {
                    const { title, description, visibility, fields } = JSON.parse(savedFormData);
                    setSurveyTitle(title);
                    setSurveyDescription(description);
                    setVisibility(visibility);
                    setFormFields(fields);
                }
            } catch (error) {
                console.error('Failed to load form data from AsyncStorage.', error);
            }
        };
        loadFormData();
    }, []);

	 // Save form data to AsyncStorage
	 const saveFormData = async () => {
        try {
            const formData = {
                title: surveyTitle,
                description: surveyDescription,
                visibility: visibility,
                fields: formFields,
            };
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        } catch (error) {
            console.error('Failed to save form data to AsyncStorage.', error);
        }
    };


	const addFormField = () => {
		const keyArr = Object.keys(formFields[formFields.length - 1]);
		const newID = formFields[formFields.length - 1][keyArr[0]].length + 1;
		const newField = {
			id: newID,
			type: 'text',
			questionString: '',
			options: [],
		};
		formFields[formFields.length - 1][keyArr[0]].push(newField)
		setFormFields([...formFields]);
		saveFormData(); // Save updated data
	};

	const removeFormField = (field, category, id) => {
		console.log('category:', field, category, id);
		const updatedFields = field[category].filter((f) => f.id !== id);
		console.log('updatedFields:', updatedFields);
		if (updatedFields.length === 0) {
			const updatedFormFields = formFields.filter((f) => Object.keys(f)[0] !== category);
			setFormFields(updatedFormFields);
		}
		else {
			field[category] = updatedFields;
			setFormFields([...formFields]);
		}
	};

	const handleInputChange = (category, text, id) => {
		// console.log('category:', category, 'text:', text, 'id:', id);
		const updatedFields = formFields.map((field) => {
			const key = Object.keys(field)[0];
			if (key === category) {
				return {
					[key]: field[key].map((f) =>
						f.id === id ? { ...f, questionString: text } : f
					),
				};
			}
			return field;
		});
		// console.log('updatedFields:', updatedFields);
		setFormFields(updatedFields);
        saveFormData();
	};

	const handleFieldTypeChange = (category, type, id) => {
		// console.log('category:', category, 'type:', type, 'id:', id);
		const updatedFields = formFields.map((field) => {
			const key = Object.keys(field)[0];
			if (key === category) {
				return {
					[key]: field[key].map((f) =>
						f.id === id ? { ...f, type, options: [] } : f
					),
				};
			}
			return field;
		});
		// console.log('updatedFields:', updatedFields);
		setFormFields(updatedFields);
		saveFormData(); // Save updated data
	};

	const addChoice = (category, id, option) => {
		const updatedFields = formFields.map((field) => {
			const key = Object.keys(field)[0];
			if (key === category) {
				return {
					[key]: field[key].map((f) =>
						f.id === id ? { ...f, options: [...f.options, option], newChoice: '' } : f
					),
				};
			}
			return field;
		});
		setFormFields(updatedFields);
		saveFormData(); // Save updated data
	};

	const removeChoice = (category, id, choiceIndex) => {
		const updatedFields = formFields.map((field) => {
			const key = Object.keys(field)[0];
			if (key === category) {
				return {
					[key]: field[key].map((f) =>
						f.id === id ? { ...f, options: f.options.filter((_, index) => index !== choiceIndex) } : f
					),
				};
			}
			return field;
		});
		setFormFields(updatedFields);
		saveFormData(); // Save updated data
	};

	const renderFieldOptions = (category, field) => {
		// console.log('category:', category, 'field:', field);
		if (field.type === 'text') {
			return null;
		} else if (field.type === 'checkbox' || field.type === 'multipleChoice') {
			return (
				<View>
					<Text style={styles.label}>Options:</Text>
					{field.options.map((choice, index) => (
						<View key={index} style={styles.choiceContainer}>
							<Text>{`${index + 1}. ${choice}`}</Text>
							<TouchableOpacity onPress={() => removeChoice(category, field.id, index)}>
								<Text style={styles.removeChoice}>Remove</Text>
							</TouchableOpacity>
						</View>
					))}
					<TextInput
						placeholder="Add option"
						style={styles.input}
						value={field.newChoice || ''}
						onChangeText={(text) => {
							const updatedFields = formFields.map((f) => {
								const key = Object.keys(f)[0];
								if (key === category) {
									return {
										[key]: f[key].map((field) =>
											field.id === field.id ? { ...field, newChoice: text } : field
										),
									};
								}
								return f;
							});
							setFormFields(updatedFields);
						}
						}
					/>
					<TouchableOpacity onPress={() => addChoice(category, field.id, field.newChoice)} style={styles.addButton}>
						<Text style={styles.addButtonText}>Add Option</Text>
					</TouchableOpacity>
				</View>
			);
		}
	};

	const handleSubmit = async () => {
		const formBody = [];
		formFields.map((field) => {
			const key = Object.keys(field)[0];
			field[key].map((f) => {
				f['category'] = key;
				formBody.push(f);
			});
		});
		console.log("new body", formBody);
		try {
			const token = await AsyncStorage.getItem('jwtToken')
			console.log(token)
			await fetch('https://1c95-2409-40e1-1009-5202-996b-5406-2bcd-36c8.ngrok-free.app/survey', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({
					title: surveyTitle,
					description: surveyDescription,
					surveyQuestions: formBody,
					visibility: visibility
				}),
			}).then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error status::${response.status}`);
				}
				console.log(response.ok);
				return response.json();
			}).then(async (data) => {
				console.log(data);
				console.log('Form Submitted:', { title: surveyTitle, description: surveyDescription, surveyQuestions: formBody, visibility: visibility });
				console.log(formBody)
				handleToast(data.message, 'green');
				navigation.navigate('Survey');
			}).catch((error) => {
				console.error('Error occurred during survey creation:', error);
				handleToast('An error occurred during survey creation. Please try again later.', 'red');
			});
		} catch (error) {
			console.error('Error occurred during survey creation:', error);
			handleToast('An error occurred during survey creation. Please try again later.', 'red');
		}
		//console.log('Form Submitted:', { title: surveyTitle, description: surveyDescription, surveyQuestions: formFields });
		//console.log(formFields)
		//alert('Form created successfully');
		//navigation.navigate('Survey');
	};

	const addCategoryField = () => {
		const key = formFields.length + 1;
		const newField = {
			[key]: [{
				id: 1,
				type: 'text',
				questionString: '',
				options: []
			}]
		};
		setFormFields([...formFields, newField]);
	}
	const handleCategoryChange = (newKey, oldKey) => {
		const updatedFields = formFields.map((category) =>
			Object.keys(category)[0] === oldKey ? { [newKey]: category[oldKey] } : category
		);
		setFormFields(updatedFields);
	}
	return (
		<View style={styles.container}>
			<ScrollView>
				<TextInput
					style={styles.input}
					value={surveyTitle}
					onChangeText={(text) => {
                        setSurveyTitle(text);
                        saveFormData();
                    }}
					placeholder="Survey Title"
				/>
				<TextInput
					style={styles.input}
					value={surveyDescription}
					onChangeText={(text) => {
                        setSurveyDescription(text);
                        saveFormData();
                    }}
					placeholder="Survey Description"
				/>
				<TouchableOpacity onPress={addCategoryField}
					style={styles.addButton}
				>
					<Text style={styles.addButtonText}>Add a new category</Text>
				</TouchableOpacity>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						marginBottom: 10,
						backgroundColor: 'white',
						paddingLeft: 10,
						borderRadius: 5,
					}}
				>
					<Text style={
						{
							fontSize: 16,
						}
					}>Visibility:</Text>
					<Picker
						selectedValue={visibility}
						style={{
							width: 150,
							height: 50,
						}}
						onValueChange={(itemValue) => setVisibility(itemValue)}
					>
						<Picker.Item label="Public" value="public" />
						<Picker.Item label="Private" value="private" />
					</Picker>
				</View>
				{

					formFields.map((field, idx) => {
						return (
							<View key={idx}
								style={styles.cateContainer}
							>
								{
									field[Object.keys(field)[0]].length > 0 &&
									<View style={{
									}}>
										<Text style={styles.label}>Category name:</Text>
										<TextInput
											style={styles.input}
											value={Object.keys(field)[0]}
											onChangeText={(text) => handleCategoryChange(text, Object.keys(field)[0])}
										></TextInput>
									</View>
								}
								{
									field[Object.keys(field)[0]].map((f) => (
										<View key={f.id}>
											<View style={styles.fieldContainer}>
												<View style={styles.fieldTypeContainer}>
													<Text style={styles.fieldTypeLabel}>Field Type:</Text>
													<Picker
														style={styles.fieldTypePicker}
														selectedValue={f.type}
														onValueChange={(itemValue) => handleFieldTypeChange(Object.keys(field)[0], itemValue, f.id)}>
														<Picker.Item label="Text" value="text" />
														<Picker.Item label="Checkbox" value="checkbox" />
														<Picker.Item label="Multiple Choice" value="multipleChoice" />
													</Picker>
													<TouchableOpacity onPress={() => removeFormField(field, Object.keys(field)[0], f.id)}>
														<Text style={styles.deleteButton}>Delete</Text>
													</TouchableOpacity>
												</View>
												<TextInput
													style={styles.input}
													value={f.questionString}
													onChangeText={(text) => handleInputChange(Object.keys(field)[0], text, f.id)}
													placeholder={`Field ${f.id}`}
												/>
												{renderFieldOptions(Object.keys(field)[0], f)}
											</View>
										</View>
									))
								}
							</View>
						)
					})

				}
				<TouchableOpacity onPress={addFormField} style={styles.addButton}>
					<Text style={styles.addButtonText}>Add Question</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
					<Text style={styles.submitButtonText}>Submit Form</Text>
				</TouchableOpacity>
			</ScrollView >
		</View>
	);
};

const styles = {
	container: {
		flex: 1,
		padding: 20,
	},
	fieldContainer: {
		marginBottom: 20,
	},
	fieldTypeContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	fieldTypeLabel: {
		marginRight: 10,
	},
	fieldTypePicker: {
		flex: 1,
	},
	deleteButton: {
		color: 'red',
		fontSize: 16,
		marginLeft: 10,
	},
	input: {
		borderWidth: 0.5,
		padding: 8,
		marginBottom: 10,
		borderRadius: 5,
		width: '100%',
	},
	label: {
		marginTop: 10,
		marginBottom: 5,
	},
	choiceContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 5,
	},
	removeChoice: {
		color: 'red',
		fontSize: 16,
		marginLeft: 5,
	},
	addButton: {
		padding: 10,
		backgroundColor: 'lightblue',
		alignItems: 'center',
		borderRadius: 5,
		marginBottom: 10,
	},
	addButtonText: {
		fontSize: 16,
	},
	submitButton: {
		padding: 10,
		backgroundColor: 'green',
		alignItems: 'center',
		borderRadius: 5,
	},
	submitButtonText: {
		fontSize: 16,
		color: 'white',
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

export default DynamicForm;
