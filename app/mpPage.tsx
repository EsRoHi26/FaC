import { Button, Card } from '@rneui/base';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import React from 'react';

export default function ProyectPage() {
    const { id, name } = useLocalSearchParams();
    const [amount, setAmount] = React.useState(1000);
    const [goal, setGoal] = React.useState(5000);

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
                                <Text style={{ fontSize: 20, textAlign: 'center' }}>${goal}</Text>
                            </Card>
                        </View>
                        <View style={{ alignItems: 'center', flex: 1 }}>
                            <Card>
                                <Card.Title><Text style={{ fontSize: 25, textDecorationStyle: 'double' }}>Actualmente</Text></Card.Title>
                                <Card.Divider />
                                <Text style={{ fontSize: 20, textAlign: 'center' }}>${amount}</Text>
                            </Card>
                        </View>
                    </View>
                    <View style={styles.card}>
                        <Text style={{ fontSize: 22}}>
                            Este es un ejemplo de texto largo para ver como se comporta el texto en la pantalla.
                        </Text>
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
    }
});