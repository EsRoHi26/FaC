import React from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { DrawerStatusContext } from '@react-navigation/drawer';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';

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
      </Drawer>
    </GestureHandlerRootView>
  );
}
