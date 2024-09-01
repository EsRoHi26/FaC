import { BackgroundImage, Button, Card, color } from '@rneui/base';
import { getBackgroundColorAsync } from 'expo-system-ui';
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const TestPage: React.FC = () => {
    const [monto, setMonto] = React.useState("");
    return (
        <View>
            <Card>
                <Card.Title>Monto actual</Card.Title>
                <Card.Divider />
                <Text style={{ fontSize: 50, marginHorizontal: 100 }}>$1000</Text>
            </Card>
            <View style={{ width: 200, alignContent: 'center', marginHorizontal: 110, marginTop: 20 }}>
                <TextInput
                    style={styles.input}
                    placeholder="Añade un monto"
                    value={monto.toString()}
                    onChangeText={setMonto}
                ></TextInput>
            </View>
            <View style={{ width: 200, alignContent: 'center', marginHorizontal: 110, marginTop: 20 }}>
                <Button title="solid"><Text style={{ fontSize: 40, color: "white" }}>+</Text></Button>
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