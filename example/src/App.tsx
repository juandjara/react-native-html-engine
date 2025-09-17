import { View, StyleSheet } from 'react-native';
import { RenderHTML } from 'react-native-html-engine';

export default function App() {
  return (
    <View style={styles.container}>
      <RenderHTML source={{ html: '<p>Hello world</p>' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
