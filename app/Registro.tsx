import React, { useState, useMemo } from 'react';
import { Link } from 'expo-router';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { Button } from '@rneui/themed';
import RadioGroup from 'react-native-radio-buttons-group';


const Registro: React.FC = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = () => {
        setLoading(true);
        setError('');

        let temp: User = {
            Cedula: cedula,
            Name: nombre,
            Correo: email,
            AreaTrabajo: area,
            DineroInicial: 0,
            Telefono: telefono,
            Rol: selectedId,
            Contrasenna: password,
            proyectoPropios: [],
            donaciones: []
        };

        fetch('http://localhost:5104/api/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(temp),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data); // handle the response data here
            })
            .catch(error => {
                setError('An error occurred. Please try again later.');
            })
            .finally(() => {
                setLoading(false);
            });

        console.log(temp);
    };


    const radioButtons = useMemo(() => ([
        {
            id: '1',
            label: 'Admistrador',
            value: 'admistrador'
        },
        {
            id: '2',
            label: 'Usuario',
            value: 'usuario'
        }
    ]), []);

    const [selectedId, setSelectedId] = useState('');
    const [nombre, setNombre] = useState('');
    const [cedula, setCedula] = useState('');
    const [email, setEmail] = useState('');
    const [area, setArea] = useState('');
    const [telefono, setTelefono] = useState('');
    const [password, setPassword] = useState('');
    const [tipo, setTipo] = useState('');
          
    interface User {
        Cedula: string;
        Name: string;
        Correo: string;
        AreaTrabajo: string;
        DineroInicial: number;
        Telefono: string;
        Rol: string;
        Contrasenna: string;
        proyectoPropios: string[];
        donaciones: string[];
    }


    return (
        <View style={styles.container}>
            <View style={styles.container2}>
                <Text style={styles.title}>Registro</Text>
                <TextInput style={styles.input} placeholder="Nombre" onChangeText={setNombre} />
                <TextInput style={styles.input} placeholder="Cédula" onChangeText={setCedula} />
                <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} />
                <TextInput style={styles.input} placeholder="Area de Trabajo" onChangeText={setArea} />
                <TextInput style={styles.input} placeholder="Telefono" onChangeText={setTelefono} />

                <RadioGroup
                    radioButtons={radioButtons}
                    onPress={setSelectedId}
                    selectedId={selectedId}
                />
                <TextInput style={styles.input} placeholder="Password" onChangeText={setPassword} />
                <Button title="solid" color='#8cc583'>
                    <Link href="/(paginas)" onPress={handleSubmit}>Registro</Link>
                </Button>
            </View>
        </View>
    );



};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#8cc583',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container2: {
        backgroundColor: '#b9e3b3',
        padding: 20,
        flex: 1,
        marginTop: 100,
        marginBottom: 100,
        width: 350,
        alignSelf: 'center',
        borderRadius: 40,

    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',

    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',

    },
    title2: {
        fontSize: 15,
        marginBottom: 15
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    dropdownButtonStyle: {
        width: 200,
        height: 50,
        backgroundColor: '#E9ECEF',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
    },
    dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    }
});

export default Registro;