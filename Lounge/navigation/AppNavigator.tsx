// navigation/AppNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ServiceLinkingScreen from '../screens/Settings/ServiceLinkingScreen';
import { useAuth } from '../store/AuthContext'; // Adjust path

// Screen components (will be created with .tsx extension)
import LoginScreen from '../screens/Auth/LoginScreen';     // Adjust path
import SignUpScreen from '../screens/Auth/SignUpScreen';   // Adjust path
import FeedScreen from '../screens/Feed/FeedScreen';       // Adjust path
import ProfileScreen from '../screens/Profile/ProfileScreen'; // Adjust path
import FriendsScreen from '../screens/Friends/FriendsScreen'; // Adjust path
import SettingsScreen from '../screens/Settings/SettingsScreen'; // Adjust path

// Define ParamList types for type safety with navigation
// https://reactnavigation.org/docs/typescript/
export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

export type ProfileStackParamList = {
  MyProfile: undefined;
  // EditProfile: undefined; // If you add this later
};

export type SettingsStackParamList = { // NEW
  SettingsMain: undefined;
  ServiceLinking: undefined;
};


export type MainTabParamList = {
  Feed: undefined;
  ProfileNavigator: undefined; // Navigator for Profile tab
  Friends: undefined;
  Settings: undefined;
  SettingsNavigator: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const ProfileStackNavigator = createStackNavigator<ProfileStackParamList>();
const SettingsStack = createStackNavigator<SettingsStackParamList>(); 

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
}

// Stack navigator for the Profile tab
function ProfileNavigator() {
    return (
        <ProfileStackNavigator.Navigator
            // screenOptions={{ headerShown: false }} // If you want custom headers within this stack
        >
            <ProfileStackNavigator.Screen
                name="MyProfile"
                component={ProfileScreen}
                options={{ title: 'Profile' }}
            />
            {/* Add ServiceLinkingScreen here later:
            <ProfileStackNavigator.Screen
                name="ServiceLinking"
                component={ServiceLinkingScreen} // You'll create this
                options={{ title: 'Link Services' }}
            />
            */}
        </ProfileStackNavigator.Navigator>
    );
}


function SettingsNavigator() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <SettingsStack.Screen
        name="ServiceLinking"
        component={ServiceLinkingScreen} // You'll create this
        options={{ title: 'Link Services' }}
      />
    </SettingsStack.Navigator>
  );
}

function MainNavigator() {
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        // headerShown: false, // Keep this if you prefer custom headers per screen
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: React.ComponentProps<typeof Ionicons>['name'] = 'alert-circle';
          if (route.name === 'Feed') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ProfileNavigator') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          } else if (route.name === 'Friends') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'SettingsNavigator') { // CHANGED
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        // To hide headers for stack navigators within tabs, set headerShown: false here,
        // or individually in the Stack.Navigator screenOptions or Stack.Screen options.
        headerShown: false, // Good default if stacks manage their own headers
      })}
    >
      <MainTab.Screen name="Feed" component={FeedScreen} />
      <MainTab.Screen
        name="ProfileNavigator"
        component={ProfileNavigator}
        options={{ tabBarLabel: 'Profile' /*, headerShown: false */ }} // headerShown false if ProfileStack handles it
      />
      <MainTab.Screen name="Friends" component={FriendsScreen} />
      <MainTab.Screen
        name="SettingsNavigator" // CHANGED
        component={SettingsNavigator}
        options={{ tabBarLabel: 'Settings' /*, headerShown: false */ }} // headerShown false if SettingsStack handles it
      />
    </MainTab.Navigator>
  );
}

export default function AppNavigator() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // You can return a loading spinner here if you prefer
    return null;
  }

  return currentUser ? <MainNavigator /> : <AuthNavigator />;
}