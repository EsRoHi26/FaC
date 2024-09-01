import { useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView } from 'react-native';

export default function ProyectPage() {
    const { id } = useLocalSearchParams();
    
    return (
        <View>
            <Text>Proyecto {id}</Text>
        </View>
    );
}