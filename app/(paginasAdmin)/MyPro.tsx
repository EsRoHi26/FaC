import { Pressable, StyleSheet } from 'react-native';
import { Text, View, ScrollView } from 'react-native';
import { Button, Card } from '@rneui/base';
import { Link } from 'expo-router';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';

interface Usuario {
    _id: string;
    cedula: string;
    name: string;
    email: string;
    areaTrabajo: string;
    dineroInicial: number,
    telefono: string;
    rol: string;
    contrasenna: string;
    proyectoPropios: string[];
    donaciones: string[];
    estado: string;
}

export default function ProyectScreen() {
    const navigation = useNavigation();
    const correos = navigation.getParent()?.getState().routes[0].params;

    const correoResp = (correos as { correo: string, carga: boolean }).correo;

    const s: string = correoResp;

    const [projects, setProjects] = React.useState<Usuario[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [otherProjects, setOtherProjects] = React.useState<Usuario[]>([]);

    const getProjects = async () => {
        setProjects([]);
        try {
            const response = await fetch('https://fac-95ei.onrender.com/api/usuarios', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const projectDetails = await response.json();
            projectDetails.forEach((project: Usuario) => {
                if (project.email !== correoResp) {
                    setProjects((oldProjects) => [...oldProjects, project]);
                }
            });
            //setProjects(projectDetails);
        } catch (e) {
            console.log(e);
        }
    };

    const activar = async () => {
        try {
            fetch('https://fac-95ei.onrender.com/api/usuarios/act/' + s, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (e) {
            console.log(e);
        }
    };

    const desactivar = async () => {
        try {
            fetch('https://fac-95ei.onrender.com/api/usuarios/des/' + s, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (e) {
            console.log(e);
        }
    };

    const borrar = async (user : Usuario) => {
        for (let i = 0; i < user.proyectoPropios.length; i++) {
            try {
                fetch('https://fac-95ei.onrender.com/api/proyectos/' + user.proyectoPropios[i], {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            }
            catch (e) {
                console.log(e);
            }
        }
        try {
            fetch('https://fac-95ei.onrender.com/api/usuarios/' + user._id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (e) {
            console.log(e);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getProjects();
            setLoading(false);
        }, [correoResp])
    );

    if (loading) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    } else {
        return (
            <View style={{ height: 700 }}>
                <ScrollView>
                    {projects.map((project, i) => (
                        <Card key={i}>
                            <Card.Title>{project.name}</Card.Title>
                            <Card.Divider />
                            <Card.Image source={{ uri: 'https://picsum.photos/200/300' }} />
                            <Text>Estado del Usuario: {project.estado}</Text>
                            <Card.Divider />
                            {project.estado === 'Activo' ? <Button onPress={desactivar}>Desactivar</Button> : <Button onPress={activar}>Activar</Button>}
                            <Card.Divider />
                            <Pressable onPress={() => borrar(project)}>
                                <Text style={styles.bttn}>Borrar</Text>
                            </Pressable>
                        </Card>
                    ))}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bttn: {
        backgroundColor: 'red',
        borderRadius: 20,
        alignItems: 'center',
        padding: 20,
        textAlign: 'center',
        color: 'white',
        fontSize: 20,
    },
});
