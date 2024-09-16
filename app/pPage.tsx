import { Button, Card } from '@rneui/base';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView, Image, StyleSheet,ActivityIndicator, TextInput } from 'react-native';
import React from 'react';
import { useState, useMemo } from 'react';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';

//import { TextInput } from 'react-native-gesture-handler';

interface Donaciones {
    monto: string;
    correoDonante: string;
    nombreDonante: string;
    telefonoDonante: string;
    proyectoId: string;
    nombreProyecto: string;
    fechaDonacion: Date;
    
}
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

export default function ProyectPage() {
    const navigation = useNavigation();
    const { id, name, correo } = useLocalSearchParams();
    const [amount, setAmount] = React.useState(1000);
    const [goal, setGoal] = React.useState(5000);
    const [monto, setMonto] = React.useState("0");
    const [project, setProject] = React.useState<Proyecto | null>(null);  // Cambiado a un solo objeto
    const [loading, setLoading] = React.useState(true);

    const navigateToDonaciones = () => {
        navigation.navigate('donaciones', { id: project._id, name: project.pName, correo: correo });
        
    }; 
    
    const getProjects = async () => {
        try {
            const response = await fetch('http://10.0.2.2:9000/api/proyectos/'+id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            
            setProject(data || null);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            getProjects();
        }, [id])
    );

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Cargando proyecto...</Text>
            </View>
        );
    }

    if (!project) {
        return (
            <View style={styles.error}>
                <Text>No se encontró el proyecto</Text>
            </View>
        );
    }

    return (
        <View>
            <ScrollView>
                <View style={styles.scrollView}>
                    <Image source={{ uri: 'https://picsum.photos/200/300' }}
                        style={{ width: 300, height: 200 }} />
                    <Text style={{ fontSize: 20, margin: 20, textAlign: 'center', textDecorationStyle: 'double' }}>Proyecto {name}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ alignItems: 'center', flex: 1 }}>
                            <Card>
                                <Card.Title><Text style={{ fontSize: 25, textDecorationStyle: 'double' }}>Monto Meta</Text></Card.Title>
                                <Card.Divider />
                                <Text style={{ fontSize: 20, textAlign: 'center' }}>${project.objetivoF}</Text>
                            </Card>
                        </View>
                        <View style={{ alignItems: 'center', flex: 1 }}>
                            <Card>
                                <Card.Title><Text style={{ fontSize: 25, textDecorationStyle: 'double' }}>Monto Recaudado</Text></Card.Title>
                                <Card.Divider />
                                <Text style={{ fontSize: 20, textAlign: 'center' }}>${project.montoReca}</Text>
                            </Card>
                        </View>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.title}>Descripción</Text>
                        <Text style={{ fontSize: 22 }}>
                            {project.descripcion}
                        </Text>
                    </View>
                    
                </View>
            </ScrollView>
            <View style={styles.card}>
            
                <Button title="Donar" onPress={navigateToDonaciones} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        alignItems: 'center',
        height: 600,
    },
    card: {
        borderRadius: 10,
        margin: 20,
        padding: 10,
        shadowColor: 'black',
        backgroundColor: 'white',
    },input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    }
});