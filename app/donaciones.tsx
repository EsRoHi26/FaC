import React, { useState, useMemo } from 'react';
import { Link, useLocalSearchParams } from 'expo-router';
import { View, TextInput, StyleSheet, Text, ScrollView } from 'react-native';
import { Button } from '@rneui/themed';
import RadioGroup from 'react-native-radio-buttons-group';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
import { Usuario } from '../app/interfaces/usuarios.interface';

import { useNavigation, useRoute, useFocusEffect  } from '@react-navigation/native';
//import DateTimePicker from '@react-native-community/datetimepicker';

import DropDownPicker from 'react-native-dropdown-picker';

interface Donaciones {
    monto: string;
    correoDonante: string;
    nombreDonante: string;
    telefonoDonante: string;
    proyectoId: string;
    nombreProyecto: string;
    fechaDonacion: Date;
    comentario: string;

}


const NuevoProyecto: React.FC = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const { id, name, correo } = route.params;


    const [valores, setValores] = useState<Donaciones>({
        monto: '',
        correoDonante: correo,
        nombreDonante: '',
        telefonoDonante: '',
        proyectoId: id,
        nombreProyecto: name,
        fechaDonacion: new Date(),
        comentario: '',
    });


    const handleForm = async () => {
        const nuevaDonacion: Donaciones = {
            ...valores,
        };

        //console.log('Datos de la donacion a enviar:', nuevaDonacion);
        try {
            //validar que tenag el dinero
            const responseUsuario = await fetch('https://fac-95ei.onrender.com/api/usuarios/correo/' + correo, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },

            });

            const usuario = await responseUsuario.json();
            const dineroDisponible = usuario.dineroInicial;
            const montoDonacion = parseFloat(valores.monto);



            if (dineroDisponible < montoDonacion) {
                alert('No tienes suficiente dinero para realizar esta donación.');
                return;
            }

            //se trae el proyecto para tener los datos de este
            const responseProyecto = await fetch('https://fac-95ei.onrender.com/api/proyectos/' + id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },

            });
            const proyecto = await responseProyecto.json();
            const montoRecaudado = proyecto.montoReca;
            const responsable =proyecto.correoResponsable;
            const montoRecad = parseFloat(montoRecaudado);


            let montoTotal = montoRecad + montoDonacion
            let montoRecaS = montoTotal.toString();



            //hace la donacion
            const response = await fetch('https://fac-95ei.onrender.com/api/donaciones/'+responsable, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevaDonacion),
            });
            alert('Donación realizada!');

            //rebaja el dinero al usuario

            let nuevoMonto = dineroDisponible - montoDonacion

            const responseDinero = await fetch(`https://fac-95ei.onrender.com/api/usuarios/actualizarDinero/${correo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nuevoMonto }),
            });

            const usuarioActualizado = await response.json();

            //actualizar el monto de donacion en el proyecto
            


            // actualizar el monto del proyecto
            const responseProyecto2 = await fetch('https://fac-95ei.onrender.com/api/proyectos/actualizarMonto/' + id, {

                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ montoRecaS }),

            });
            const proyecto2 = await responseProyecto2.json();
            //console.log('Proyecto actualizado:', proyecto2); 

        } catch (error) {
            console.error('Error al hacer la donacion', error);
        }
    };


    const handleInputChange = ( value: string | number, campo: keyof Donaciones,) => {
        if (campo === 'monto' || campo === 'telefonoDonante' ) {
            const numero = parseInt(value, 10); 
            if (!isNaN(numero)) {
                setValores(prevValores => ({
                    ...prevValores,
                    [campo]: value,
                }));
            } else {
                alert('Solo puedes ingresar números.');
                setValores(prevValores => ({
                    ...prevValores,
                    [campo]: '',
                }));
                //console.warn(`Valor inválido para ${campo}: ${value}`);
            }
        } 
        else {
        setValores(prevValores => ({
            ...prevValores,
            [campo]: value,
        }))};
    };

    useFocusEffect(
        React.useCallback(() => {
            // Aquí puedes ejecutar cualquier función que quieras que se ejecute cuando la pantalla se enfoque
            setValores(prev => ({
                ...prev,
                correoDonante: correo, // Puedes actualizar cualquier otro valor
            }));
        }, [correo])
    );

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.container2}>
                    <Text style={styles.title}>Nueva Donación</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Nombre donante"
                        onChangeText={text => handleInputChange(text, 'nombreDonante')}
                        value={valores.nombreDonante}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Teléfono"
                        inputMode='numeric'
                        onChangeText={text => handleInputChange(text, 'telefonoDonante')}
                        value={valores.telefonoDonante}
                    />



                    <TextInput
                        style={styles.input}
                        placeholder="Monto"
                        inputMode='numeric'
                        onChangeText={(text) => handleInputChange(text, 'monto')}
                        value={valores.monto}
                    />


                    <Text>Comentario</Text>
                    <TextInput
                        style={[styles.input]}
                        multiline={true}
                        placeholder="Comentario"
                        onChangeText={text => handleInputChange(text, 'comentario')}
                        value={valores.comentario}


                    />


                    <Button title="Donar" onPress={handleForm} />
                </View>
            </View>
        </ScrollView>

    );
}
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
        marginBottom: 200,
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
    },
    dropdown: {
        marginBottom: 20,
        borderWidth: 1,
        borderRadius: 10,
    },
    dropdownContainer: {
        borderWidth: 1,
        borderRadius: 10,
    },
});


export default NuevoProyecto;