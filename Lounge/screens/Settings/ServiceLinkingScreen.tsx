// screens/Settings/ServiceLinkingScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useSpotifyAuth } from '../../services/spotifyAuth'; // Correctly imports the hook
import { SPOTIFY_CLIENT_ID } from '../../constants/apiKeys'; // Ensures Client ID is available for checks (though useSpotifyAuth uses it)

export default function ServiceLinkingScreen() {
  const [spotifyAccessToken, setSpotifyAccessToken] = useState<string | null>(null);
  // Combined loading state for Spotify operations (checking token, authenticating, disconnecting)
  const [isSpotifyProcessing, setIsSpotifyProcessing] = useState<boolean>(true); // True initially to check stored token

  // useSpotifyAuth hook provides the necessary functions and state for the auth flow
  // `request` is null until the discovery document is loaded and config is ready.
  // `promptAsync` initiates the auth flow.
  // `exchangeCodeForToken` is our function to handle the code exchange.
  const { request, promptAsync, exchangeCodeForToken } = useSpotifyAuth();

  // Effect 1: Load stored Spotify access token on component mount
  useEffect(() => {
    const loadStoredToken = async () => {
      setIsSpotifyProcessing(true);
      try {
        const token = await SecureStore.getItemAsync('spotify_access_token');
        setSpotifyAccessToken(token);
      } catch (error) {
        console.error("ServiceLinkingScreen: Failed to load Spotify token from secure store:", error);
        Alert.alert("Storage Error", "Could not load stored Spotify token. Please try connecting again.");
      } finally {
        setIsSpotifyProcessing(false);
      }
    };
    loadStoredToken();
  }, []); // Empty dependency array ensures this runs once on mount

  const handleSpotifyConnect = async () => {
    // Pre-condition check: `request` object must be available.
    // The button should be disabled if !request, but this is an extra safeguard.
    if (!request) {
      Alert.alert("Spotify Auth Not Ready", "Spotify authentication setup is not complete. Please ensure your Client ID is correct or try again in a moment.");
      return;
    }

    setIsSpotifyProcessing(true);
    try {
      const authResponse = await promptAsync(); // Opens the browser for Spotify login

      if (authResponse?.type === 'success') {
        const { code } = authResponse.params;
        // Alert.alert("Spotify Auth", `Got code: ${code}. Exchanging for token...`); // For debugging
        await exchangeCodeForToken(code); // This function handles storing the new token
        const newAccessToken = await SecureStore.getItemAsync('spotify_access_token');
        setSpotifyAccessToken(newAccessToken); // Update UI state
        Alert.alert("Success!", "Spotify connected successfully.");
      } else if (authResponse?.type === 'error') {
        console.error("Spotify Auth Error (promptAsync):", authResponse.params);
        Alert.alert('Spotify Auth Error', authResponse.params.error_description || 'Login failed or was denied by Spotify.');
      } else if (authResponse?.type === 'cancel' || authResponse?.type === 'dismiss') {
        Alert.alert('Spotify Auth Cancelled', 'The Spotify login attempt was cancelled or dismissed.');
      }
      // Other types like 'locked' could also be handled if necessary
    } catch (error: any) {
      // This catch block handles errors from promptAsync itself or from exchangeCodeForToken if it throws
      console.error("ServiceLinkingScreen: Spotify connection process error:", error);
      Alert.alert("Connection Error", error.message || "An unexpected error occurred during Spotify connection.");
    } finally {
      setIsSpotifyProcessing(false); // Processing finished for this attempt
    }
  };

  const handleSpotifyDisconnect = async () => {
    setIsSpotifyProcessing(true);
    try {
      await SecureStore.deleteItemAsync('spotify_access_token');
      await SecureStore.deleteItemAsync('spotify_refresh_token');
      setSpotifyAccessToken(null); // Update UI state
      Alert.alert("Spotify Disconnected", "You have been disconnected from Spotify.");
    } catch (error) {
      console.error("ServiceLinkingScreen: Failed to disconnect Spotify:", error);
      Alert.alert("Disconnection Error", "Could not disconnect Spotify. Please try again.");
    } finally {
      setIsSpotifyProcessing(false);
    }
  };

  // Determine if the Spotify auth mechanism is ready (requires SPOTIFY_CLIENT_ID to be set for `request` to be valid)
  const isSpotifyAuthAvailable = !!request && !!SPOTIFY_CLIENT_ID;


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Link Services</Text>

      {/* Spotify Section */}
      <View style={styles.serviceSection}>
        <Text style={styles.serviceTitle}>Spotify</Text>
        {isSpotifyProcessing && <ActivityIndicator style={styles.activityIndicator} size="small" color="tomato"/>}

        {!isSpotifyProcessing && (
          <>
            {isSpotifyAuthAvailable ? (
              spotifyAccessToken ? (
                <>
                  <Text style={styles.statusText}>Status: Connected to Spotify</Text>
                  <Button title="Disconnect Spotify" onPress={handleSpotifyDisconnect} color="#e74c3c" />
                </>
              ) : (
                <Button title="Connect Spotify" onPress={handleSpotifyConnect} color="#2ecc71" />
              )
            ) : (
              <Text style={styles.errorText}>
                Spotify connection is not available. Please check app configuration (e.g., missing Client ID).
              </Text>
            )}
          </>
        )}
      </View>

      {/* Placeholder for Letterboxd */}
      <View style={styles.serviceSection}>
        <Text style={styles.serviceTitle}>Letterboxd</Text>
        <Button title="Connect Letterboxd (TODO)" onPress={() => Alert.alert("TODO", "Letterboxd connection functionality to be implemented.")} />
      </View>

      {/* Placeholder for Hardcover/Goodreads */}
      <View style={styles.serviceSection}>
        <Text style={styles.serviceTitle}>Hardcover</Text>
        <Button title="Connect Hardcover (TODO)" onPress={() => Alert.alert("TODO", "Hardcover connection functionality to be implemented.")} />
      </View>
       <Text style={styles.infoText}>
        Remember to configure your Spotify Redirect URI in the Spotify Developer Dashboard.
        The URI for Expo Go is logged in your console when `spotifyAuth.ts` initializes.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#f4f6f8', // Light background color
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#333',
  },
  serviceSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#2c3e50',
  },
  statusText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#27ae60', // Green for connected
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 14,
    color: '#c0392b', // Red for error
    marginTop: 5,
  },
  activityIndicator: {
    marginVertical: 10,
    alignSelf: 'center',
  },
  infoText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 20,
    paddingHorizontal: 10,
  }
});