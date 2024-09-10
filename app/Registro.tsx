import React, { useState, useMemo } from 'react';
import { Link } from 'expo-router';
import { View, TextInput, StyleSheet, Text, ScrollView } from 'react-native';
import { Button } from '@rneui/themed';
import RadioGroup from 'react-native-radio-buttons-group';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
import { Usuario } from './interfaces/usuarios.interface';


interface Job {
    cedula: string;
    name: string;
    email: string;
    areaTrabajo: string;
    dineroInicial: string;
    telefono: string;
    rol: string;
    contrasenna: string;
    proyectoPropios: string[]; 
    donaciones: string[];    
}

const Registro: React.FC = () => {
    const [job, setJob] = useState<Job>(
        {
            cedula: '',
            name: '',
            email: '',
            areaTrabajo: '',
            dineroInicial: '0',
            telefono: '',
            rol: '',
            contrasenna: '',
            proyectoPropios: [''], 
            donaciones: [''],    
        }
    );
    
    const handleInputChange = (value: string, campo: keyof Job) => {
        if (campo === 'cedula' || campo === 'telefono' ) {
            const numero = parseInt(value, 10); 
            if (!isNaN(numero)) {
                setJob((prevJob) => ({
                    ...prevJob,
                    [campo]: value,
                }));
            } else {
                console.warn(`Valor inválido para ${campo}: ${value}`);
            }
        } 
        else {
            setJob((prevJob) => ({
                ...prevJob,
                [campo]: value,
            }));
        }
    };

    
    const handleForm = () => {
        console.log("Datos del usuario a guardar:", JSON.stringify(job));
        if (!job.cedula || !job.name || !job.email || !job.areaTrabajo || !job.telefono || !job.rol || !job.contrasenna) {
            console.log("cedula:", job.cedula);
            console.log("nombre:", job.name);
            console.log("email:", job.email);
            console.log("area de Trabajo:", job.areaTrabajo);
            console.log("dinero Inicial:", job.dineroInicial);
            console.log("telefono:", job.telefono);
            console.log("rol:", job.rol);
            console.log("contrasenna:", job.contrasenna);

            alert('Por favor, completa todos los campos.');
            return;
        }

        fetch('http://10.0.2.2:9000/api/usuarios/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(job),
        })
        .then((response) => {
            console.log('Respuesta del servidor:', response);
            return response;
        })
        .then(() => {
            alert('Usuario creado con éxito');   
        })
            .catch((error) => {
                console.error('Error en la creación del usuario:', error);
                alert('Hubo un error al crear el usuario: ' + error.message);  
            });
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

    const handleRadioPress = (id: string) => {
        setSelectedId(id);
        const selectedButton = radioButtons.find(button => button.id === id);
        if (selectedButton) {
            setJob(prevJob => ({
                ...prevJob,
                rol: selectedButton.value // Actualiza el rol según el botón seleccionado
            }));
        }
    };

    return (
        <ScrollView>
        <View style={styles.container}>
            <View style={styles.container2}>
                <Text style={styles.title}>Registro</Text>
                <TextInput style={styles.input} placeholder="Nombre" onChangeText={(text) => handleInputChange(text, 'name')} value={job.name}  />
                <TextInput style={styles.input} placeholder="Cédula"  onChangeText={(text) => handleInputChange(text, 'cedula')} value={job.cedula} />
                <TextInput style={styles.input} placeholder="Email" onChangeText={(text) => handleInputChange(text, 'email')} value={job.email}/>
                <TextInput style={styles.input} placeholder="Area de Trabajo" onChangeText={(text) => handleInputChange(text, 'areaTrabajo')} value={job.areaTrabajo}/>
                <TextInput style={styles.input} placeholder="Telefono" onChangeText={(text) => handleInputChange(text, 'telefono')} value={job.telefono}/>
                
                <RadioGroup 
                    radioButtons={radioButtons} 
                    onPress={handleRadioPress}
                    selectedId={selectedId}
                />
                <TextInput style={styles.input} placeholder="Contraseña" onChangeText={(text) => handleInputChange(text, 'contrasenna')} value={job.contrasenna}/>
                <Button title= "Guardar" color='#8cc583' onPress={handleForm} />
            </View>
        </View>
        </ScrollView>
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