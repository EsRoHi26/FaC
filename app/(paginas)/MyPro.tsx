import { Pressable, StyleSheet } from 'react-native';
import { Text, View, ScrollView } from 'react-native';
import { Button, Card } from '@rneui/base';
import { Link } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
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

export default function ProyectScreen() {
    const navigation = useNavigation();
    const correos = navigation.getParent()?.getState().routes[0].params;
    
    const correoResp = (correos as { correo: string }).correo;
    
    const s: string = correoResp;

    
    const [projects, setProjects] = React.useState<Proyectos[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [projectIds, setProjectIds] = React.useState<string[]>([]);

    const getProjectById = async (id: string) => {
        try {
            const response = await fetch(`http://10.0.2.2:9000/api/proyectos/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return await response.json();
        } catch (e) {
            console.log(e);
        }
    };

    const getProjects = async () => {
        try {
            const response = await fetch('http://10.0.2.2:9000/api/usuariosMP/' + correoResp, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const projectIds = await response.json();
            setProjectIds(projectIds);

            const projectDetailsPromises = projectIds.map((id: string) => getProjectById(id));
            const projectDetails = await Promise.all(projectDetailsPromises);
            setProjects(projectDetails);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        getProjects();
    }, []);

    const navigateToProyecto = () => {
        navigation.navigate('NuevoProyecto');
        
    };

    return (
        <View>
            <View style={{ height: 700 }}>
                <ScrollView>
                    {!loading && projects.map((project, i) => (
                        <Link href={{
                            pathname: "/mpPage",
                            params: { id: project._id }
                        }} key={i} asChild>
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
                <Link href={{ pathname: "/NuevoProyecto" }}>
                    <View style={styles.bttn}>
                        <Text style={{textAlign:'center', color:'white'}}>Nuevo Proyecto</Text>
                    </View>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    bttn: {
        backgroundColor: 'blue',
        borderRadius: 20,
        alignItems: 'center',
        padding: 20,
    },
});