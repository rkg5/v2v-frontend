import Toast from 'react-native-root-toast';

export default function handleToast(message, color) {
    Toast.show(message, {
        duration: Toast.durations.SHORT,
        backgroundColor: color,
        shadow: true,
    });
}

