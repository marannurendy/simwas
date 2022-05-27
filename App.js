import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Home } from './source';
import { Router } from './routes';
import FlashMessage from "react-native-flash-message"

export default function App() {
  return (
    <View style={ styles.container }>
      <Router />
      <FlashMessage position="top" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
