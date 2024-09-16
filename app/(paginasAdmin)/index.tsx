import { Pressable, StyleSheet } from 'react-native';
import { Text, View, ScrollView } from 'react-native';
import { Button, Card } from '@rneui/base';
import { Link} from 'expo-router';
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


export default function HomeScreen() {
  const [projects, setProjects] = React.useState<Proyectos[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [otherProjects, setOtherProjects] = React.useState<Proyectos[]>([]);

  const navigation = useNavigation();
  const correo = navigation.getParent()?.getState().routes[0].params;
  const correoResp = (correo as { correo: string }).correo;
  const s: string = correoResp;

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
         /* await projectDetails.forEach((project:Proyectos) => {
          
          if (project.correoResponsable !== correoResp) {
            setOtherProjects((oldProjects) => [...oldProjects, project]);
          }
          setLoading(false);
        })*/
      });
    } catch (e) {
      console.log(e);
    }
  }

  React.useEffect(() => {
    getProjects();
  }, []);

  useFocusEffect(
    useCallback(() => {
        getProjects();
        setLoading(false);
    }, [correoResp])
);

  return (
    <View>
      <View style={{ height: 700 }}>
        <ScrollView>
          {!loading && projects.map((project, i) => (
            <Link href={{
              pathname: "/mpPage",
              params: { id: project._id, name: project.pName, correo: s }
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
      
    </View>
  );
}


