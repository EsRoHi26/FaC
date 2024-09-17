import React, { useState, useMemo } from 'react';
import { Link, useLocalSearchParams } from 'expo-router';
import { View, TextInput, StyleSheet, Text, ScrollView } from 'react-native';
import { Button } from '@rneui/themed';
import RadioGroup from 'react-native-radio-buttons-group';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
//import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker'; // Importar DropDownPicker

interface Proyecto {
    descripcion: string;
    objetivoF: string;
    categoriaP: string;
    mediaItems: string[];
}

const NuevoProyecto: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { id, name, correo } = route.params;
    //const { id } = useLocalSearchParams();

    
    const [valores, setValores] = useState<Proyecto>({
        descripcion: '',
        objetivoF: '',
        categoriaP: '',
        mediaItems: [""],
    });
    const [loading, setLoading] = React.useState(true);
    const [open, setOpen] = useState(false); 
    const [categoria, setCategoria] = useState('');  
    const [categorias, setCategorias] = useState([
        { label: 'Tecnología', value: 'tecnologia' },
        { label: 'Salud', value: 'salud' },
        { label: 'Educación', value: 'educacion' },
        { label: 'Cultura', value: 'cultura' },
        { label: 'Deportes', value: 'deportes' },
        { label: 'Otro', value: 'otro' }
    ]);

    

    const handleForm = async () => {

        if (!valores.objetivoF || !valores.descripcion || !categoria) {
            alert('Todos los campos deben ser completados.');
            return;
        }
        const nuevoProyecto: Proyecto = {
            ...valores,
            categoriaP: categoria,
        };

        console.log('Datos del proyecto a enviar:', nuevoProyecto);
        try {
            const response = await fetch('https://fac-95ei.onrender.com/api/proyectos/' + id + '/' + correo + '/' + name, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevoProyecto),
            });
            alert('Proyecto modificado con exito!');



        } catch (error) {
            console.error('Error al modificar el proyecto:', error);
        }
    };

    const handleInputChange = ( value: string | number, campo: keyof Proyecto, ) => {



        if (campo === 'objetivoF'  ) {
            const numero = parseInt(value, 10); 
            if (!isNaN(numero)) {
                setValores(prevValores => ({
                    ...prevValores,
                    [campo]: value,
                }));
            }
            else {
                alert('Solo puedes ingresar números.');
                setValores(prevValores => ({
                    ...prevValores,
                    [campo]: '',
                }));
                //console.warn(`Valor inválido para ${campo}: ${value}`);
            }
        }
        setValores(prevValores => ({
            ...prevValores,
            [campo]: value,
        }));
    };

    const handleObjetivoFBlur = () => {
        const regexObjetivoF = /^[0-9]*$/;
        const objetivoFIngresado = valores.objetivoF;
        
        if (!regexObjetivoF.test(objetivoFIngresado)) {
            alert('El objetivo de recaudación debe ser un número entero.');
            setValores(prevValores => ({
                ...prevValores,
                objetivoF: '',
            }));
            return;
        }
    }
/*
    const handleFechaBlur = () => {
        const regexFecha = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const fechaIngresada = valores.fechaLimite;
        
        if (!regexFecha.test(fechaIngresada)) {
            alert('La fecha debe estar en el formato dd/mm/yyyy.');
            setValores(prevValores => ({
                ...prevValores,
                fechaLimite: '',
            }));
            return;
        }

        const [dia, mes, anio] = fechaIngresada.split('/').map(Number);
        const fechaActual = new Date();
        const fechaUsuario = new Date(anio, mes - 1, dia); 

        if (mes < 1 || mes > 12 || dia < 1 || dia > 31) {
            alert('El día o mes no son válidos.');
            setValores(prevValores => ({
                ...prevValores,
                fechaLimite: '',
            }));
            return;
        }

        // Validar días máximos en meses
        const diasEnMes = [31, (anio % 4 === 0 && anio % 100 !== 0) || anio % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (dia > diasEnMes[mes - 1]) {
            alert('El día no es válido para el mes ingresado.');
            setValores(prevValores => ({
                ...prevValores,
                fechaLimite: '',
            }));
            return;
        }

        // Validar que la fecha ingresada sea mayor o igual a la fecha actual
        if (fechaUsuario < fechaActual) {
            alert('La fecha límite debe ser mayor o igual que la fecha actual.');
            setValores(prevValores => ({
                ...prevValores,
                fechaLimite: '',
            }));
            return;
        }
    };
*/

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.container2}>
                    <Text style={styles.title}>Actualizar Proyecto</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Objetivo de recaudación"
                        onChangeText={text => handleInputChange(text, 'objetivoF')}
                        value={valores.objetivoF}
                        maxLength={10}
                        onBlur={handleObjetivoFBlur} 
                    />


                    <Text>Descripción</Text>
                    <TextInput
                        style={[styles.input]}
                        multiline={true}
                        placeholder="Descripcion"
                        onChangeText={text => handleInputChange(text, 'descripcion')}
                        value={valores.descripcion}


                    />
                    <Text style={styles.title2}>Categoría</Text>
                    <DropDownPicker
                        open={open}
                        value={categoria}
                        items={categorias}
                        setOpen={setOpen}
                        setValue={setCategoria}
                        setItems={setCategorias}
                        placeholder="Seleccionar categoría"
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                        maxHeight={150}  
                        scrollViewProps={{
                            nestedScrollEnabled: true, 
                        }}
                    />

                    <Button title="Actualizar" onPress={handleForm}  />
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