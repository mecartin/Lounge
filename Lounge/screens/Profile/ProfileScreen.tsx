// screens/Profile/ProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { ProfileStackParamList } from '../../navigation/AppNavigator'; // For typed navigation if needed from here
import { MainTabParamList } from '../../navigation/AppNavigator'; // For navigating to other tabs perhaps
import * as SecureStore from 'expo-secure-store';
import { getRecentlyPlayed, SpotifyTrack } from '../../services/spotifyService'; // Will create this

// If ProfileScreen needs to navigate within its own stack or to other tabs:
type ProfileScreenNavigationProp = NavigationProp<ProfileStackParamList & MainTabParamList, 'MyProfile'>;


export default function ProfileScreen() {
  const { currentUser } = useAuth();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [recentlyPlayed, setRecentlyPlayed] = useState<SpotifyTrack[]>([]);
  const [isLoadingSpotify, setIsLoadingSpotify] = useState<boolean>(false);
  const [spotifyError, setSpotifyError] = useState<string | null>(null);

  const fetchSpotifyData = async () => {
    const accessToken = await SecureStore.getItemAsync('spotify_access_token');
    if (accessToken) {
      setIsLoadingSpotify(true);
      setSpotifyError(null);
      try {
        const data = await getRecentlyPlayed();
        setRecentlyPlayed(data.items.map((item: any) => item.track)); // Adjust based on actual API response
      } catch (error: any) {
        console.error("Failed to fetch Spotify data:", error);
        setSpotifyError(error.message || "Failed to load Spotify data. Token might be expired.");
        // Potentially trigger token refresh here if implemented
      } finally {
        setIsLoadingSpotify(false);
      }
    }
  };

  useEffect(() => {
    fetchSpotifyData();
  }, [currentUser]); // Re-fetch if user changes or on focus (see React Navigation events)

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        {currentUser && <Text style={styles.emailText}>Logged in as: {currentUser.email}</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spotify Activity</Text>
        {isLoadingSpotify && <ActivityIndicator size="large" color="tomato" />}
        {spotifyError && <Text style={styles.errorText}>{spotifyError}</Text>}
        {!isLoadingSpotify && !spotifyError && !recentlyPlayed.length && (
          <Text>No Spotify activity found or Spotify not linked. Link in Settings!</Text>
        )}
        {recentlyPlayed.map((item: SpotifyTrack) => (
          <View key={item.id} style={styles.trackItem}>
            <Text style={styles.trackName}>{item.name}</Text>
            <Text style={styles.artistName}>{item.artists.map((artist: { name: string }) => artist.name).join(', ')}</Text>
          </View>
        ))}
        {/* Add a button to refresh or link if not linked, or guide to settings */}
      </View>

      {/* Placeholder for other services */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Letterboxd Activity (Placeholder)</Text>
        {/* <Button title="Link Letterboxd" onPress={() => { /* Navigate to service linking * / }} /> */}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hardcover/Goodreads Activity (Placeholder)</Text>
        {/* <Button title="Link Hardcover" onPress={() => { /* Navigate to service linking * / }} /> */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    padding: 20,
    backgroundColor: 'tomato',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  emailText: {
    fontSize: 14,
    color: '#fff',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 15,
    paddingBottom: 15,
    backgroundColor: '#fff',
    marginHorizontal: 10,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  trackItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  trackName: {
    fontSize: 16,
    fontWeight: '500',
  },
  artistName: {
    fontSize: 14,
    color: '#555',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  // Add more styles for buttons, cards etc.
});