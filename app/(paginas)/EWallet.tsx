import { BackgroundImage, Button, Card, color } from '@rneui/base';
import { getBackgroundColorAsync } from 'expo-system-ui';
import React, { useCallback } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Usuario } from '../interfaces/usuarios.interface';

interface email {
    correo: string;
}

function TestPage() {
    const [monto, setMonto] = React.useState("0");
    const [montoTxt, setMontoTxt] = React.useState("0");
    // let montoTxt = "1000"

    const getMoney = async (mail: string) => {
        const responseUsuario = await fetch('http://10.0.2.2:9000/api/usuarios/correo/' + mail, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },

        });
        const usuario = await responseUsuario.json();
        const dineroDisponible = usuario.dineroInicial;
        setMontoTxt(dineroDisponible);
        return dineroDisponible;

    }


    const navigation = useNavigation();
    const correo = navigation.getParent()?.getState().routes[0].params;
    const correoResp = (correo as { correo: string }).correo;
    useFocusEffect(
        useCallback(() => {
            if (correoResp) {
                getMoney(correoResp);
            }
        }, [correoResp])
    );

    const handleMontoChange = (text: string) => {
        if (/^\d*$/.test(text)) {
            setMonto(text);
        }
        else{
            alert("Solo se permiten números");
        }
    };

    const add = () => {
        const newMontoTxt = (parseInt(monto) + parseInt(montoTxt)).toString();

        fetch('http://10.0.2.2:9000/api/usuarios/dinero/' + correoResp, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dinero: newMontoTxt,
            }),
        }).then((response) => {
            if (response.status === 200) {
                console.log('Monto actualizado');
                setMontoTxt(newMontoTxt);
            } else {
                throw new Error('No se pudo actualizar el monto');
            }
        });
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
                    onChangeText={handleMontoChange}
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