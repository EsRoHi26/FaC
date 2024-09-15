import { Pressable, StyleSheet } from 'react-native';
import { Text, View, ScrollView } from 'react-native';
import { Button, Card } from '@rneui/base';
import { Link } from 'expo-router';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';

interface Proyectos {
    _id: string;
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

export default function ProyectScreen() {
    const navigation = useNavigation();
    const correos = navigation.getParent()?.getState().routes[0].params;

    const correoResp = (correos as { correo: string, carga: boolean }).correo;

    const s: string = correoResp;

    const [projects, setProjects] = React.useState<Proyectos[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [otherProjects, setOtherProjects] = React.useState<Proyectos[]>([]);

    const getProjects = async () => {
        setOtherProjects([]);
        try {
            const response = await fetch('http://10.0.2.2:9000/api/proyectos', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const projectDetails = await response.json();
            setProjects(projectDetails);
            const filteredProjects = projectDetails.filter(
                (project: Proyectos) => project.correoResponsable === correoResp
            );
            setOtherProjects(filteredProjects);
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
            <View>
                <View style={{ height: 700 }}>
                    <ScrollView>
                        {otherProjects.map((project, i) => (
                            <Link
                                href={{
                                    pathname: '/mpPage',
                                    params: { id: project._id, name: project.pName, correo: s }
                                }}
                                key={i}
                                asChild
                            >
                                <Pressable>
                                    <Card key={i}>
                                        <Card.Title>{project.pName}</Card.Title>
                                        <Card.Divider />
                                        <Card.Image source={{ uri: 'https://picsum.photos/200/300' }} />
                                        <Text>{project.descripcion}</Text>
                                    </Card>
                                </Pressable>
                            </Link>
                        ))}
                    </ScrollView>
                </View>
                <View style={{ width: 200, alignContent: 'center', marginHorizontal: 140, marginTop: 20 }}>
                    <Link href={{ pathname: '/NuevoProyecto' }}>
                        <View style={styles.bttn}>
                            <Text style={{ textAlign: 'center', color: 'white' }}>Nuevo Proyecto</Text>
                        </View>
                    </Link>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bttn: {
        backgroundColor: 'blue',
        borderRadius: 20,
        alignItems: 'center',
        padding: 20,
    },
});
