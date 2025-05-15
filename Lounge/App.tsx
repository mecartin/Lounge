// App.tsx
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator'; // Will be created
import { AuthProvider } from './store/AuthContext';   // Will be created
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen'; // For newer Expo asset loading

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [assetsLoaded, setAssetsLoaded] = useState<boolean>(false);

  useEffect(() => {
    async function loadAssetsAsync() {
      try {
        await Font.loadAsync({
          // Example:
          // 'YourFont-Regular': require('./assets/fonts/YourFont-Regular.ttf'),
          // 'YourFont-Bold': require('./assets/fonts/YourFont-Bold.ttf'),
        });
        // Add other assets here:
        // await Asset.loadAsync([require('./assets/images/my-image.png')]);
      } catch (e) {
        console.warn(e);
      } finally {
        setAssetsLoaded(true);
        SplashScreen.hideAsync(); 
      }
    }

    loadAssetsAsync();
  }, []);

  if (!assetsLoaded) {
    return null; // Or a custom loading component, or AppLoading if using older expo
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}