// screens/Settings/SettingsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { SettingsStackParamList } from '../../navigation/AppNavigator'; // For typed navigation

type SettingsScreenNavigationProp = NavigationProp<SettingsStackParamList, 'SettingsMain'>;

export default function SettingsScreen() {
  const { logout, currentUser } = useAuth();
  const navigation = useNavigation<SettingsScreenNavigationProp>();

  const handleLogout = async () => {
    try {
      await logout();
      // AppNavigator will automatically redirect to Auth screens
    } catch (error: any) {
      Alert.alert("Logout Failed", error.message || "Could not log out.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {currentUser && (
        <View style={styles.userInfo}>
          <Text>Logged in as: {currentUser.email}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Link / Manage Services"
          onPress={() => navigation.navigate('ServiceLinking')}
          color="tomato"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Edit Profile (Placeholder)"
          onPress={() => Alert.alert("Placeholder", "Edit Profile functionality to be added.")}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Logout"
          onPress={handleLogout}
          color="#888"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  userInfo: {
    marginBottom: 30,
    alignItems: 'center',
  },
  buttonContainer: {
    marginBottom: 15,
  },
});