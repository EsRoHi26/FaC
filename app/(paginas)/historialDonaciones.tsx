import { Pressable, StyleSheet } from 'react-native';
import { Text, View, ScrollView } from 'react-native';
import { Button, Card } from '@rneui/base';
import { Link } from 'expo-router';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';

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

export default function ProyectScreen() {
    const navigation = useNavigation();
    const correos = navigation.getParent()?.getState().routes[0].params;

    const correoResp = (correos as { correo: string, carga: boolean }).correo;

    const s: string = correoResp;
    console.log(s)

    const [projects, setProjects] = React.useState<Donaciones[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [otherProjects, setOtherProjects] = React.useState<Donaciones[]>([]);

    const getProjects = async () => {
        setOtherProjects([]);
        try {
            const response = await fetch('http://10.0.2.2:9000/api/donaciones/'+s, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const projectDetails = await response.json();
            setProjects(projectDetails);
            /*const filteredProjects = projectDetails.filter(
                (project: Donaciones) => project.correoDonante === correoResp
            );*/
            setOtherProjects(projectDetails);
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
                                    params: { id: project._id, name: project.nombreProyecto, correo: s }
                                }}
                                key={i}
                                asChild
                            >
                                
                                    <Card key={i}>
                                        <Card.Title>Donación</Card.Title>
                                        <Text>Proyecto: {project.nombreProyecto}</Text>
                                        <Card.Divider />
                                        <Text>Monto donado: {project.monto}</Text>
                                        <Card.Divider />
                                        <Text>Fecha de la donación: {new Date(project.fechaDonacion).toLocaleDateString()}</Text>
                                        <Card.Divider />
                                        <Text>Comentario: {project.comentario}</Text>   
                                    </Card>
                                
                            </Link>
                        ))}
                    </ScrollView>
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
