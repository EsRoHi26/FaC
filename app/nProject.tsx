import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const ProjectForm: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [goalAmount, setGoalAmount] = useState('');

    const handleSubmit = () => {
        // Handle form submission here
        // You can access the form values using the state variables (title, description, image, goalAmount)
    };

    return (
        <View style={styles.card}>
            <TextInput
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
            />
            <TextInput
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
            />
            <TextInput
                placeholder="Image"
                value={image}
                onChangeText={setImage}
                style={styles.input}
            />
            <TextInput
                placeholder="Goal Amount"
                value={goalAmount}
                onChangeText={setGoalAmount}
                keyboardType="numeric"
                style={styles.input}
            />
            <Button title="Crear" onPress={handleSubmit} />
        </View>
    );
};

export default ProjectForm;

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        margin: 20,
        padding: 10,
        shadowColor: 'black',
        backgroundColor: 'white',
    }, input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
});