import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  Text,
  SafeAreaView,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Card from "../Components/Card";
import Form from "../SurveyForm/SurveyForm";
import LandingPage from "../LandingPage/Landingpage";
import Logout from "../LogOut/Logout";
import EditDetailsPage from "../Profile/ProfilePage";
import Files from "../Files/Files";

const LogoAndTitle = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../../assets/logo.webp")}
        style={{ width: 50, height: 50 }}
      />
      <Text style={{ fontSize: 24, marginLeft: 10 }}>V2V</Text>
    </View>
  );
};
const Survey = () => {
  const [surveyList, setSurveyList] = useState([]);
  const navigation = useNavigation();
  // const netInfo = NetInfo.fetch()
  useEffect(() => {
    const fetchData = async () => {
      // if (netInfo.isConnected) {
      // 	console.log("Connected")
      // 	const fetchFormResponse = await AsyncStorage.getItem('offlineData');
      // 	for (let i = 0; i < fetchFormResponse.length; i++) {
      // 		const curr = fetchFormResponse[i];
      // 		if (curr.uploaded === false) {
      // 			await uploadOffileData(curr);
      // 			await AsyncStorage.removeItem('offlineData');
      // 		}
      // 		else {
      // 			await AsyncStorage.removeItem('offlineData');
      // 		}
      // 	}
      // }
    //   try {
    //     const apiUrl = "http://15.206.178.11/api/survey/getAllSurveys";
    //     const token = await AsyncStorage.getItem("jwtToken");
    //     const response = await fetch(apiUrl, {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${token}`,
    //       },
    //     })
    //       .then((response) => {
    //         return response.json();
    //       })
    //       .then((data) => {
    //         setSurveyList(data.data);
    //         console.log(data);
    //       });
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
	try {
        const apiUrl = "https://1c95-2409-40e1-1009-5202-996b-5406-2bcd-36c8.ngrok-free.app/survey/getAllSurveys";
        const token = await AsyncStorage.getItem("jwtToken");
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSurveyList(data.data);  // Assuming the API returns an object with `data` containing the surveys
          console.log(data);
        } else {
          console.log("Failed to fetch surveys");
        }
      } catch (error) {
        console.log("Error fetching surveys:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
	{surveyList.length > 0 ? (
      <FlatList
        data={surveyList}
        keyExtractor={(data, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("CreateSurvey", {
                surveyList,
                data: item,
                setSurveyList,
              })
            }
          >
            <Card data={item} />
          </TouchableOpacity>
        )}
      />
	) : (
        <Text style={styles.noSurveysText}>No surveys available</Text>
    )}
    </View>
  );
};

const Drawer = createDrawerNavigator();
const ViewSurvey = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer.Navigator
        initialRouteName="Survey"
        screenOptions={{
          headerTitle: (props) => <LogoAndTitle {...props} />,
        }}
      >
        <Drawer.Screen name="LandingPage" component={LandingPage} />
        <Drawer.Screen name="Survey" component={Survey} />
        <Drawer.Screen name="Profile" component={EditDetailsPage} />
        <Drawer.Screen name="Create Survey" component={Form} />
        <Drawer.Screen name="Files" component={Files} />
        <Drawer.Screen name="Log Out" component={Logout} />
      </Drawer.Navigator>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  bottomButtons: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "column",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    marginVertical: 5,
    width: "80%",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ViewSurvey;
