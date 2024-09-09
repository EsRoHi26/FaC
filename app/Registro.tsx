import React, { useState, useMemo } from 'react';
import { Link } from 'expo-router';
import { View, TextInput, StyleSheet, Text, ScrollView } from 'react-native';
import { Button } from '@rneui/themed';
import RadioGroup from 'react-native-radio-buttons-group';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
import { Usuario } from './interfaces/usuarios.interface';


interface Job {
    Cedula: string;
    Name: string;
    Correo: string;
    AreaTrabajo: string;
    DineroInicial: number;
    Telefono: string;
    Rol: string;
    Contrasenna: string;
    proyectosIds: string[]; 
    donaciones: string[];    
}

const Registro: React.FC = () => {
    const [dineroInicial, setDineroInicial] = useState(0);
    const [usuario, setUsuarios] = useState<Usuario[]>([]);
    const [job, setJob] = useState<Job>(
        {
            Cedula: '',
            Name: '',
            Correo: '',
            AreaTrabajo: '',
            DineroInicial: 0,
            Telefono: '',
            Rol: '',
            Contrasenna: '',
            proyectosIds: [''], 
            donaciones: [''],    
        }
    );
    
    const handleInputChange = (value: string, campo: keyof Job) => {
        if (campo === 'Cedula' || campo === 'Telefono' ) {
            const numero = parseInt(value, 10); 
            if (!isNaN(numero)) {
                setJob((prevJob) => ({
                    ...prevJob,
                    [campo]: numero,
                }));
            } else {
                console.warn(`Valor inválido para ${campo}: ${value}`);
            }
        } 
        else if (campo === 'DineroInicial') {
            const dinero = parseFloat(value); // Convertir texto a float
            if (!isNaN(dinero)) {
                setJob((prevJob) => ({
                    ...prevJob,
                    DineroInicial: dinero,
                }));
                setDineroInicial(dinero); // Actualiza también el estado separado
            } else {
                console.warn(`Valor inválido para DineroInicial: ${value}`);
            }
        }
        else {
            setJob((prevJob) => ({
                ...prevJob,
                [campo]: value,
            }));
        }
    };


    const testConnection = async () => {
        try {
            const response = await fetch('http://192.168.0.9:5104');
            if (response.ok) {
                const data = await response.json();
                console.log('Conexión exitosa. Datos:', data);
                alert('Conexión exitosa con el backend.');
            } else {
                console.log('Error en la respuesta:', response.statusText);
                alert('Error en la respuesta del backend.');
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            alert('Error al conectarse con el backend: ' + error);
        }
    };
    
    const checkURLResolution = async () => {
        try {
            const response = await fetch('http://192.168.0.9:5104', {
                method: 'HEAD', // Método HEAD para comprobar si responde sin descargar datos.
            });
            if (response.ok) {
                alert('El backend está disponible y responde.');
            } else {
                alert('Error en la conexión con el backend: ' + response.statusText);
            }
        } catch (error) {
            alert('Error de conexión: ' + error);
        }
    };
    
    const handleForm = () => {
        console.log("Datos del usuario a guardar:", job);
        if (!job.Cedula || !job.Name || !job.Correo || !job.AreaTrabajo || job.DineroInicial <= 0 || !job.Telefono || !job.Rol || !job.Contrasenna) {
            console.log("Cedula:", job.Cedula);
            console.log("Nombre:", job.Name);
            console.log("Correo:", job.Correo);
            console.log("Area de Trabajo:", job.AreaTrabajo);
            console.log("Dinero Inicial:", job.DineroInicial);
            console.log("Telefono:", job.Telefono);
            console.log("Rol:", job.Rol);
            console.log("Contraseña:", job.Contrasenna);

            alert('Por favor, completa todos los campos.');
            return;
        }

        fetch('http://192.168.0.9:5104/api/usuarios', {
            method: 'POST',
            body: JSON.stringify(job),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
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

    const handleRadioPress = (id: string) => {
        setSelectedId(id);
        const selectedButton = radioButtons.find(button => button.id === id);
        if (selectedButton) {
            setJob(prevJob => ({
                ...prevJob,
                Rol: selectedButton.value // Actualiza el rol según el botón seleccionado
            }));
        }
    };

    return (
        <ScrollView>
        <View style={styles.container}>
            <View style={styles.container2}>
                <Text style={styles.title}>Registro</Text>
                <TextInput style={styles.input} placeholder="Nombre" onChangeText={(text) => handleInputChange(text, 'Name')} value={job.Name}  />
                <TextInput style={styles.input} placeholder="Cédula"  onChangeText={(text) => handleInputChange(text, 'Cedula')} value={job.Cedula} />
                <TextInput style={styles.input} placeholder="Email" onChangeText={(text) => handleInputChange(text, 'Correo')} value={job.Correo}/>
                <TextInput style={styles.input} placeholder="Area de Trabajo" onChangeText={(text) => handleInputChange(text, 'AreaTrabajo')} value={job.AreaTrabajo}/>
                <TextInput style={styles.input} placeholder="Telefono" onChangeText={(text) => handleInputChange(text, 'Telefono')} value={job.Telefono}/>
                <TextInput style={styles.input} placeholder="Dinero inicial" onChangeText={(text) => handleInputChange(text, 'DineroInicial')} value={dineroInicial.toString()}/>
                
                <RadioGroup 
                    radioButtons={radioButtons} 
                    onPress={handleRadioPress}
                    selectedId={selectedId}
                />
                <TextInput style={styles.input} placeholder="Contraseña" onChangeText={(text) => handleInputChange(text, 'Contrasenna')} value={job.Contrasenna}/>
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