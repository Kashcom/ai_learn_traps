import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import TopicSelectionScreen from './src/screens/TopicSelectionScreen';
import BookSelectionScreen from './src/screens/BookSelectionScreen';
import ChapterSelectionScreen from './src/screens/ChapterSelectionScreen';
import GameScreen from './src/screens/GameScreen';
import ProfileScreen from './src/screens/ProfileScreen';

import { UserProvider } from './src/context/UserContext';

const Stack = createNativeStackNavigator();

function AppContent() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' } // Let screens handle bg to avoid flashes
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="TopicSelection" component={TopicSelectionScreen} />
          <Stack.Screen name="BookSelection" component={BookSelectionScreen} />
          <Stack.Screen name="ChapterSelection" component={ChapterSelectionScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </ThemeProvider>
  );
}
