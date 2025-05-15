// services/spotifyAuth.ts
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, AuthRequestConfig } from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '../constants/apiKeys'; // Make sure this path is correct

WebBrowser.maybeCompleteAuthSession();

export const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const SPOTIFY_SCOPES = [
  "user-read-email",
  "user-library-read",
  "user-read-recently-played",
  "user-top-read",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-follow-read",
  "user-read-playback-state",
  "user-read-currently-playing"
];

export function useSpotifyAuth() {
  const redirectUri = makeRedirectUri({
    //useProxy: true, // This ensures it works in Expo Go
    // native: 'yourappscheme://spotify-auth' // For standalone builds later
  });
  console.log("Spotify Redirect URI for Expo Go:", redirectUri);


  const authRequestConfig: AuthRequestConfig = {
    clientId: SPOTIFY_CLIENT_ID,
    scopes: SPOTIFY_SCOPES,
    usePKCE: false, // Spotify API does not support PKCE for this flow when client secret is used client-side.
                     // For PKCE (recommended, more secure), token exchange MUST happen on a backend without client secret.
    redirectUri,
  };

  const [request, response, promptAsync] = useAuthRequest(authRequestConfig, discovery);

  const exchangeCodeForToken = async (authCode: string): Promise<void> => {
    // WARNING: Client-side token exchange with client_secret is INSECURE for production.
    // This is simplified for an alpha. For a real app, this MUST be done on a backend server.
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
        const errorMessage = "Spotify client ID or secret is missing. Cannot exchange token.";
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    try {
      const credsB64 = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`); // Base64 encode
      const tokenResponse = await fetch(discovery.tokenEndpoint, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credsB64}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=authorization_code&code=${authCode}&redirect_uri=${redirectUri}`,
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok) {
        throw new Error(tokenData.error_description || tokenData.error || 'Failed to exchange token');
      }

      if (tokenData.access_token) {
        await SecureStore.setItemAsync('spotify_access_token', tokenData.access_token);
        if (tokenData.refresh_token) {
          await SecureStore.setItemAsync('spotify_refresh_token', tokenData.refresh_token);
        }
        // TODO: Optionally store tokens against the Firebase user ID in Firestore for server-side access
      } else {
        throw new Error(tokenData.error_description || 'Failed to get Spotify access token from response.');
      }
    } catch (e: any) {
      console.error("Spotify token exchange failed:", e);
      throw e; // Re-throw to be caught by the caller
    }
  };

  // This useEffect was in the guide for ServiceLinkingScreen;
  // It's better handled directly in ServiceLinkingScreen after promptAsync resolves.
  // Kept here for reference if direct hook side-effect is needed, but usually UI drives the exchange.
  // React.useEffect(() => {
  //   if (response?.type === 'success') {
  //     const { code } = response.params;
  //     exchangeCodeForToken(code)
  //       .then(() => console.log("Token exchanged successfully via hook effect"))
  //       .catch(e => console.error("Token exchange failed via hook effect:", e.message));
  //   } else if (response?.type === 'error') {
  //     Alert.alert('Spotify Auth Error (Hook)', response.params.error_description || 'Something went wrong');
  //   }
  // }, [response]);

  return { request, response, promptAsync, exchangeCodeForToken };
}

// Function to refresh Spotify token (Example - needs error handling and to be called appropriately)
export async function refreshSpotifyToken(): Promise<string | null> {
  const refreshToken = await SecureStore.getItemAsync('spotify_refresh_token');
  if (!refreshToken || !SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    console.log('No refresh token or client credentials available for Spotify.');
    await SecureStore.deleteItemAsync('spotify_access_token'); // Clear expired access token
    return null;
  }

  // WARNING: Client-side token exchange with client_secret is INSECURE for production.
  try {
    const credsB64 = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);
    const response = await fetch(discovery.tokenEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credsB64}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    });

    const tokenData = await response.json();
    if (!response.ok) {
        throw new Error(tokenData.error_description || 'Failed to refresh token');
    }

    if (tokenData.access_token) {
      await SecureStore.setItemAsync('spotify_access_token', tokenData.access_token);
      // Spotify sometimes returns a new refresh token
      if (tokenData.refresh_token) {
        await SecureStore.setItemAsync('spotify_refresh_token', tokenData.refresh_token);
      }
      return tokenData.access_token;
    }
    return null;
  } catch (error) {
    console.error('Spotify token refresh error:', error);
    // If refresh fails (e.g. invalid refresh token), clear tokens and prompt re-login
    await SecureStore.deleteItemAsync('spotify_access_token');
    await SecureStore.deleteItemAsync('spotify_refresh_token');
    return null;
  }
}