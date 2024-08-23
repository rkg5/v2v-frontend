import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Button = props => {
    const { onPress, textStyle, children, buttonStyle, disabled } = props;
    return (
        <TouchableOpacity
            onPress={onPress}
            style={disabled ? styles.disabledBackground : buttonStyle}
            disabled={disabled}>
            <Text style={disabled ? styles.disabledText : textStyle}>
                {children}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    disabledBackground: {
        backgroundColor: '#ACACAC',
        minHeight: 50,
        width: '100%',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    disabledText: {
        color: '#FFFFFF',
        fontSize: 16,
        lineHeight: 20,
        fontFamily: 'Poppins-Regular'
    }
});

export default Button;
