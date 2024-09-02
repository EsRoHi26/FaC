import { Card } from '@rneui/base';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import React from 'react';

export default function ProyectPage() {
    const { id } = useLocalSearchParams();
    const [amount, setAmount] = React.useState(1000);
    const [goal, setGoal] = React.useState(5000);

    return (
        <View style={styles.scrollView}>
            <ScrollView>
                <Image source={{ uri: 'https://picsum.photos/200/300' }}
                    style={{ width: 300, height: 200 }} />
                <Text style={{ fontSize: 20, margin: 20 }}>Proyecto {id}</Text>
                <View style={{ flex: 2 }}>
                    <View style={{ width: 300, alignItems: 'center', flex:1 }}>
                        <Card>
                            <Card.Title><Text style={{ fontSize: 25, textDecorationStyle: 'double' }}>Monto Meta</Text></Card.Title>
                            <Card.Divider />
                            <Text style={{ fontSize: 20, textAlign:'center' }}>${goal}</Text>
                        </Card>
                    </View>
                    <View style={{ width: 300, alignItems: 'center', flex:1 }}>
                        <Card>
                            <Card.Title><Text style={{ fontSize: 25, textDecorationStyle: 'double' }}>Monto Actual</Text></Card.Title>
                            <Card.Divider />
                            <Text style={{ fontSize: 20, textAlign:'center'}}>${amount}</Text>
                        </Card>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        alignItems: 'center',
    },
});