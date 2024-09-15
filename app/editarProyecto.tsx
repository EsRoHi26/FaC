import React, { useState, useMemo } from 'react';
import { Link, useLocalSearchParams } from 'expo-router';
import { View, TextInput, StyleSheet, Text, ScrollView } from 'react-native';
import { Button } from '@rneui/themed';
import RadioGroup from 'react-native-radio-buttons-group';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
//import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker'; // Importar DropDownPicker

interface Proyecto {
    descripcion: string;
    objetivoF: string;
    categoriaP: string;
    mediaItems: string[];
}

const NuevoProyecto: React.FC = () => {

    const { id } = useLocalSearchParams();

    //const { correo } = useLocalSearchParams();
    
    console.log("Proyecto edit "+id)
    
    const [valores, setValores] = useState<Proyecto>({
        descripcion: '',
        objetivoF: '',
        categoriaP: '',
        mediaItems: [""],
    });

    const [open, setOpen] = useState(false);  // Estado para controlar el dropdown
    const [categoria, setCategoria] = useState('');  // Estado para la categoría seleccionada
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
            const proyectoCreado = 1



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
                    <Text style={styles.title}>Actualizar Proyecto</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Objetivo de recaudación"
                        onChangeText={text => handleInputChange(text, 'objetivoF')}
                        value={valores.objetivoF}
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