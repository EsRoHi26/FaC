import React, { useState, useMemo } from 'react';
import { Link, useLocalSearchParams } from 'expo-router';
import { View, TextInput, StyleSheet, Text, ScrollView } from 'react-native';
import { Button } from '@rneui/themed';
import RadioGroup from 'react-native-radio-buttons-group';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
import { Usuario } from '../interfaces/usuarios.interface';
//import DateTimePicker from '@react-native-community/datetimepicker';
import { Crear } from '../functions/Functions';
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker'; 
interface Proyecto {
    correoResponsable: string;
    pName: string;
    descripcion: string;
    objetivoF: string;
    montoReca: string;
    fechaLimite: string;
    categoriaP: string;
    mediaItems: string[];
    donaciones: string[];
}

const NuevoProyecto: React.FC = () => {

    //const { correo } = useLocalSearchParams();
    const navigation = useNavigation();
    const correos = navigation.getParent()?.getState().routes[0].params;
    
    const correoResp = (correos as { correo: string }).correo;
    

    
    const [valores, setValores] = useState<Proyecto>({
        correoResponsable: correoResp,
        pName: '',
        descripcion: '',
        objetivoF: '',
        montoReca: '0',
        fechaLimite: '',
        categoriaP: '',
        mediaItems: ["fyftyft"],
        donaciones: [],
    });

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

    const handleForm = () => {
        const nuevoProyecto: Proyecto = {
            ...valores,
            categoriaP: categoria,
        };

        console.log('Datos del proyecto a enviar:', nuevoProyecto);
        try {
            const proyectoCreado = Crear(nuevoProyecto);
            navigation.getParent()?.setParams({ carga: true});



        } catch (error) {
            console.error('Error al crear el proyecto:', error);
        }
    };

    const handleInputChange = (
        value: string | number,
        campo: keyof Proyecto,
    ) => {
        setValores(prevValores => ({
            ...prevValores,
            [campo]: value,
        }));
    };


    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.container2}>
                    <Text style={styles.title}>Nuevo Proyecto</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Nombre"
                        onChangeText={text => handleInputChange(text, 'pName')}
                        value={valores.pName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Objetivo de recaudación"
                        onChangeText={text => handleInputChange(text, 'objetivoF')}
                        value={valores.objetivoF}
                    />


                    <TextInput
                        style={styles.input}
                        placeholder="Fecha límite"
                        onChangeText={text => handleInputChange(text, 'fechaLimite')}
                        value={valores.fechaLimite}
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

                    <Button title="Crear" onPress={handleForm}  />
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