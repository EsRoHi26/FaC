import { Pressable, StyleSheet } from 'react-native';
import { Text, View, ScrollView } from 'react-native';
import { Button, Card } from '@rneui/base';
import { Link } from 'expo-router';


export default function ProyectScreen() {

    return (
        <View>
            <View style={{ height: 700 }}>
                <ScrollView>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <Link href={{
                            pathname: "/mpPage",
                            params: { id: i }
                        }} key={i} asChild>
                            <Pressable>
                                <Card key={i}>
                                    <Card.Title>Nombre del Proyecto</Card.Title>
                                    <Card.Divider />
                                    <Card.Image source={{ uri: 'https://picsum.photos/200/300' }} />
                                    <Text>Descripción del proyecto {i}</Text>
                                </Card>
                            </Pressable>
                        </Link>
                    ))}
                </ScrollView>
            </View>
            <View style={{ width: 200, alignContent: 'center', marginHorizontal: 140, marginTop: 20 }}>
                <Link href={{ pathname: "/nProject" }}>
                    <View style={styles.bttn}>
                        <Text style={{textAlign:'center', color:'white'}}>
                            Nuevo Proyecto
                        </Text>
                    </View>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    bttn:{
        backgroundColor: 'blue',
        borderRadius: 20,
        alignItems: 'center',
        padding: 20,
    },
});