import React from "react";
import { View, Image, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootSiblingParent } from "react-native-root-siblings";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Home from "./pages/Home/Home";
import SurveyForm from "./pages/SurveyForm/SurveyForm";
import ViewSurvey from "./pages/ViewSurvey/ViewSurvey";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import CreateSurvey from "./pages/CreateSurvey/CreateSurvey";
import ShareSurvey from "./pages/CreateSurvey/ShareSurvey";
import EditDetailsPage from "./pages/Profile/ProfilePage";
import Weather from "./pages/Weather/Weather";
import LandingPage from "./pages/LandingPage/Landingpage";
const Stack = createStackNavigator();

const LogoAndTitle = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Image
        source={require("./assets/logo.webp")}
        style={{ width: 50, height: 50 }}
      />
      <Text style={{ fontSize: 24, marginLeft: 10 }}>V2V</Text>
    </View>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootSiblingParent>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerTitle: (props) => <LogoAndTitle {...props} />,
            }}
          >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="LandingPage" component={LandingPage} options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="SurveyForm" component={SurveyForm} />
            <Stack.Screen name="CreateSurvey" component={CreateSurvey} />
            <Stack.Screen name="ShareSurvey" component={ShareSurvey} />
            <Stack.Screen name="EditDetailsPage" component={EditDetailsPage} />
            <Stack.Screen
              name="ViewSurvey"
              component={ViewSurvey}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Weather" component={Weather} />
          </Stack.Navigator>
        </NavigationContainer>
      </RootSiblingParent>
    </GestureHandlerRootView>
  );
};

export default App;
