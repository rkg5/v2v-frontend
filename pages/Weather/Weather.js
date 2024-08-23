import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { OPENWEATHERMAP_API_KEY } from '@env';  // Correct import

const Weather = () => {
    const [location, setLocation] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);

            const { latitude, longitude } = location.coords;
            fetchWeatherData(latitude, longitude);
        })();
    }, []);

    const fetchWeatherData = async (latitude, longitude) => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`
            );
            setWeatherData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text>Loading weather data...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {weatherData ? (
                <>
                    <Text style={styles.locationText}>{weatherData.name}</Text>
                    <Text style={styles.temperatureText}>
                        {Math.round(weatherData.main.temp)}°C
                    </Text>
                    <Image
                        style={styles.weatherIcon}
                        source={{
                            uri: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
                        }}
                    />
                    <Text style={styles.weatherDescription}>
                        {weatherData.weather[0].description}
                    </Text>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.detailsText}>Humidity: {weatherData.main.humidity}%</Text>
                        <Text style={styles.detailsText}>Wind: {weatherData.wind.speed} m/s</Text>
                    </View>
                </>
            ) : (
                <Text>No weather data available</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
    locationText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    temperatureText: {
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    weatherIcon: {
        width: 100,
        height: 100,
    },
    weatherDescription: {
        fontSize: 18,
        fontStyle: 'italic',
        marginBottom: 20,
    },
    detailsContainer: {
        marginTop: 20,
    },
    detailsText: {
        fontSize: 16,
        marginBottom: 5,
    },
});

export default Weather;
