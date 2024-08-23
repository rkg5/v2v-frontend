import React from 'react';
import { Button, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
export default function Logout() {
    const navigation = useNavigation();
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button onPress={() => navigation.navigate('Home')} title="Log out" />
        </View>
    );
}