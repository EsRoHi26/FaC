import { Button, Card } from '@rneui/base';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute,  useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';

interface Proyectos {
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
    const [project, setProject] = React.useState<Proyectos | null>(null);  // Cambiado a un solo objeto
    const [loading, setLoading] = React.useState(true);

    

    const navigateToProyecto = () => {
        navigation.navigate('editarProyecto', { id: project._id, name: project.pName, correo: correo });
        
    }; 

    const getProjects = async () => {
        try {
            const response = await fetch('https://fac-95ei.onrender.com/api/proyectos/' + id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            
            setProject(data);  
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            setLoading(true);
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
                            <Text style={styles.title}> Fecha límite </Text>
                            <Text style={{ fontSize: 22 }}>
                                {project.fechaLimite}
                            </Text>

                    </View>
                    <View>
                    <Button title= "Editar" color='#8cc583' onPress={navigateToProyecto} />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        alignItems: 'center',
        height: 700,
    },
    card: {
        borderRadius: 10,
        margin: 20,
        padding: 10,
        shadowColor: 'black',
        backgroundColor: 'white',
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
    },
});
