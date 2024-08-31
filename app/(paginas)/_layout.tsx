import React from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="test" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Home',
            title: 'overview',
          }}
        />
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Main',
            title: 'Main',
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
