import { BackgroundImage, Button, Card, color } from '@rneui/base';
import { getBackgroundColorAsync } from 'expo-system-ui';
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Usuario } from '../interfaces/usuarios.interface';

interface email{
    correo: string;
}

function TestPage () {
    const [monto, setMonto] = React.useState("0");
    const [montoTxt, setMontoTxt] = React.useState("1000");
    // let montoTxt = "1000"

    const getMoney = (mail:string) => {
        const link:string = 'http://192.168.0.9:9000/api/usuarios/correo/'+mail;
        console.log(link);
        fetch(link , {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            if (response.status === 200) {
                console.log('Usuario encontrado');
                response.json().then((data) => {
                    //console.log(data);
                    console.log(data[0].dineroInicial);
                    setMontoTxt(data[0].dineroInicial);
                    return data[0].dineroInicial;
                });
            } else {
                throw new Error('Usuario no encontrado');
            }
        })
    }

    const navigation = useNavigation();
    const correo: email = navigation.getParent()?.getState().routes[0].params;
    getMoney(correo.correo.toString());

    const add = () => {
        const newMontoTxt = (parseInt(monto) + parseInt(montoTxt)).toString();
        setMontoTxt(newMontoTxt);
        console.log(newMontoTxt);
    }

    return (
        <View>
            <Card>
                <Card.Title><Text style={{ fontSize: 25, textDecorationStyle: 'double' }}>Monto actual</Text></Card.Title>
                <Card.Divider />
                <Text style={{ fontSize: 50, marginHorizontal: 100 }}>${montoTxt}</Text>
            </Card>
            <View style={{ width: 200, alignContent: 'center', marginHorizontal: 110, marginTop: 20 }}>
                <TextInput
                    style={styles.input}
                    inputMode='numeric'
                    placeholder="Añade un monto"
                    value={monto}
                    onChangeText={setMonto}
                ></TextInput>
            </View>
            <View style={{ width: 200, alignContent: 'center', marginHorizontal: 110, marginTop: 20 }}>
                <Button title="solid" onPress={add}><Text style={{ fontSize: 40, color: "white" }}>+</Text></Button>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
});

export default TestPage;