// services/spotifyService.ts
import * as SecureStore from 'expo-secure-store';
import { refreshSpotifyToken } from './spotifyAuth'; // For token refresh logic

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

// Define a more specific type for a track if needed, this is basic
export interface SpotifyArtist {
    name: string;
    id: string;
}
export interface SpotifyTrack {
    id: string;
    name: string;
    artists: SpotifyArtist[];
    album: {
        images: { url: string }[];
    };
    external_urls: {
        spotify: string;
    };
}
export interface RecentlyPlayedResponse {
    items: { track: SpotifyTrack; played_at: string }[];
    // Add other fields from the response if needed
}

// Helper function to make authenticated Spotify API requests
async function fetchSpotifyAPI(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
  let token = await SecureStore.getItemAsync('spotify_access_token');
  if (!token) {
    throw new Error('No Spotify access token available. Please connect Spotify first.');
  }

  let response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json', // If sending a body
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) { // Token expired
    console.log('Spotify token expired, attempting refresh...');
    token = await refreshSpotifyToken();
    if (token) {
      // Retry the request with the new token
      response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });
    } else {
      throw new Error('Spotify token refresh failed. Please re-authenticate.');
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: { message: 'Failed to parse error response from Spotify' } }));
    console.error("Spotify API Error Data:", errorData);
    throw new Error(errorData.error?.message || `Spotify API request failed with status ${response.status}`);
  }

  // For 204 No Content (e.g. unfollow)
  if (response.status === 204) {
    return null;
  }
  return response.json();
}


export async function getRecentlyPlayed(limit: number = 10): Promise<RecentlyPlayedResponse> {
  return fetchSpotifyAPI(`/me/player/recently-played?limit=${limit}`);
}

export async function getCurrentUserSpotifyProfile(): Promise<any> {
    return fetchSpotifyAPI('/me');
}

// Add more functions as needed: getTopTracks, getPlaylists, etc.
// Example:
// export async function getTopTracks(limit: number = 5, time_range: string = 'medium_term'): Promise<any> {
//   return fetchSpotifyAPI(`/me/top/tracks?limit=${limit}&time_range=${time_range}`);
// }