import 'react-native-gesture-handler';  // This must be the first import
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TierSelection from './app/tier-selection';
import Dare from './app/dare';
import End from './app/end';
import Scores from './app/scores';
import React, { useState, useEffect } from 'react';

const Stack = createStackNavigator();

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

// Error boundary component
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('App Error:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Something went wrong!</Text>
          <Text style={styles.errorDetail}>{this.state.error?.message}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Add any initialization logic here
    const prepare = async () => {
      try {
        // Add any async initialization here
        setIsReady(true);
      } catch (e) {
        console.error('Initialization error:', e);
        // Handle initialization error
      }
    };
    prepare();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="TierSelection"
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: '#fff' }
            }}
          >
            <Stack.Screen name="TierSelection" component={TierSelection} />
            <Stack.Screen name="Dare" component={Dare} />
            <Stack.Screen name="End" component={End} />
            <Stack.Screen name="Scores" component={Scores} />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    color: '#E53935',
    marginBottom: 10,
  },
  errorDetail: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
