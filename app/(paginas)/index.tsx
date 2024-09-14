import { Pressable, StyleSheet } from 'react-native';
import { Text, View, ScrollView } from 'react-native';
import { Button, Card } from '@rneui/base';
import { Link, useNavigation } from 'expo-router';
import React from 'react';

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


export default function HomeScreen() {
  const [projects, setProjects] = React.useState<Proyectos[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [otherProjects, setOtherProjects] = React.useState<Proyectos[]>([]);

  const navigation = useNavigation();
  const correo = navigation.getParent()?.getState().routes[0].params;
  const correoResp = (correo as { correo: string }).correo;

  const getProjects = async () => {
    try {
      const response = await fetch('http://10.0.2.2:9000/api/proyectos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(async (response) => {
        const projectDetails = await response.json();
        setProjects(projectDetails);
        await projectDetails.forEach((project:Proyectos) => {
          console.log(project.correoResponsable);
          console.log(correoResp);
          if (project.correoResponsable !== correoResp) {
            setOtherProjects((oldProjects) => [...oldProjects, project]);
          }
          setLoading(false);
        }
        )});
    } catch (e) {
      console.log(e);
    }
  }

  React.useEffect(() => {
    getProjects();
  }, []);

  return (
    <View>
      <View style={{ height: 700 }}>
        <ScrollView>
          {!loading && otherProjects.map((project, i) => (
            <Link href={{
              pathname: "/pPage",
              params: { id: project._id, name: project.pName }
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
      <View style={{ width: 200, alignContent: 'center', marginHorizontal: 110, marginTop: 20 }}>
        <Button title="solid">Historial</Button>
      </View>
    </View>
  );
}


