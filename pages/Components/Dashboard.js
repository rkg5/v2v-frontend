import React from 'react';
import { View, Text, Button } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

const DashboardScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Dashboard</Text>
      <Button
        title="Open Drawer"
        onPress={() => navigation.openDrawer()}
      />
    </View>
  );
};

const Dashboard = () => {
  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator initialRouteName="Dashboard">
        <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default Dashboard;
