import React from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { DrawerStatusContext } from '@react-navigation/drawer';
import { Button } from '@rneui/base';
import { useNavigation } from '@react-navigation/native';

export default function TabLayout() {
  const navigation = useNavigation();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="EWallet" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'E-Wallet',
            title: 'E-Wallet',
          }}
        />
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Donaciones',
            title: 'Donaciones',
          }}
        />
        <Drawer.Screen
          name= "MyPro"
          options={{
            drawerLabel: 'Mis Proyectos',
            title: 'Mis Proyectos',
          }}
        />
        <Drawer.Screen
          name= "NuevoProyecto"
          options={{
            drawerLabel: 'Nuevo Proyecto',
            title: 'Nuevo Proyecto',
          }}
        />
        <Drawer.Screen
          name= "historialDonaciones"
          options={{
            drawerLabel: 'Historial Donaciones',
            title: 'Historial Donaciones',
          }}
        />
      
      </Drawer>
      <Button onPress={()=> navigation.navigate('index')}>Salir</Button>
    </GestureHandlerRootView>
  );
}
