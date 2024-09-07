import React, { useState } from 'react';
import { Link } from 'expo-router';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Implement your login logic here
        console.log('Logging in...');
    };

    const navigation = useNavigation();

    const navigateToRegistro = () => {
        navigation.navigate('Registro');
    };

    return (
        <View style={styles.container}>
            <View style={styles.container2}>
                <Text style={styles.title}>Login</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <Button title= "solid" color='#A1E79F'>
                <Link href="/(paginas)">Login</Link>
                </Button>
                <Text style={styles.title2}>Sign up</Text>
                <Button title= "Registro" color='#A1E79F'  onPress={navigateToRegistro}/>
                
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    container2: {
        backgroundColor: '#D1FDD6',
        padding: 20,
        flex: 1,
        marginTop: 180,
        marginBottom: 200,
        width: 350,
        alignSelf: 'center',
        borderRadius: 40,

    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        borderRadius: 10,
        paddingHorizontal: 8,
    },
    title: {
        fontSize: 24,
        margin: 15,
        fontWeight: 'bold',

    },
    title2: {
        fontSize: 15,
        fontWeight: 'bold',
        alignSelf: 'center',
        margin: 110,
        marginBottom: 15
    }
});

export default LoginScreen;