import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import ScannerScreen from './src/screens/ScannerScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScannerScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
