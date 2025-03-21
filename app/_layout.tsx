import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false, title: "Principal" }} />
          <Stack.Screen name="(paginas)" options={{ headerShown: false }} />
          <Stack.Screen name="(paginasAdmin)" options={{ headerShown: false }} />
          <Stack.Screen name="mpPage" options={{ title: "Mis proyectos" }} />
          <Stack.Screen name="pPage" options={{ title: "Donar" }} />
          <Stack.Screen name="nProject" options={{ title: "Nuevo proyecto" }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
  );
}
