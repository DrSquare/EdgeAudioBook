/**
 * Main App Component
 */
import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { HomeScreen } from './screens/HomeScreen';

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <HomeScreen />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  }
});

export default App;
