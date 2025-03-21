import React, { useState } from 'react';
import { Link } from 'expo-router';
import { View, TextInput, StyleSheet, Text, Image } from 'react-native';
import { Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = (param: string) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigation = useNavigation();

    const handleLogin = async () => {
        const resp = await fetch('https://fac-95ei.onrender.com/api/autenticacion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "email": email, "contrasenna": password }),
        });
        const data = await resp.json();
        console.log(data);
        if (data.mensaje === 'usuario' || data.mensaje === 'admistrador') {
            navigateToHome(data.mensaje);
        } else {
            alert(data.mensaje);
            /*.then((response) => {
                if (response.status === 200) {
                    navigateToHome();
                    return response.json();
                } else {
                    console.log(response);
                    let msg = resp.json();
                    alert('Usuario no encontrado');
                    throw new Error('Usuario no encontrado');
                }
            })
        
                console.log('Logging in...');
              */
        }
    };

    const navigateToRegistro = () => {
        navigation.navigate('Registro');

    };

    const navigateToHome = (rol: string) => {
        if (rol === 'usuario') {
            navigation.setParams({ correo: email });
            param = email;
            navigation.navigate('(paginas)');
        }
        else {
            navigation.setParams({ correo: email });
            param = email;
            navigation.navigate('(paginasAdmin)');
        }
    }

    return (
        <View style={styles.container}>
            <View style={{ paddingTop: 100 }}>
                <Image
                    source={require('../assets/images/Logo.png')}
                    style={{ width: 150, height: 150 }}
                />
            </View>
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
                <Button title="solid" color='#A1E79F' onPress={handleLogin}>Login</Button>
                <Text style={styles.title2}>Sign up</Text>
                <Button title="Registro" color='#A1E79F' onPress={navigateToRegistro} />

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
        marginTop: 80,
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