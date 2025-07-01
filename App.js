import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import GameScreen from './components/GameScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerText}>TicTacNow </Text>
          <Text style={styles.headerText}>(XO) Game </Text>
        </View>
          <Pressable style={styles.headerButton}><Text style={styles.headerButtonText}>Reset</Text></Pressable>
          <Pressable style={styles.headerButton}><Text style={styles.headerButtonText}>about</Text></Pressable>
      </View>
      <GameScreen></GameScreen>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010518',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 14,
    fontWeight: 600,
    color: "white",
    flex: 0.5,
    marginHorizontal: 15
  },
  header: {
    flexDirection: "row",
  },
  headerButton: {
    borderColor: "#6A8D8A",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 5,
    marginHorizontal: 8,
    alignContent: "center",
    justifyContent: "center"
  },
  headerButtonText: {
    fontSize: 13,
    fontWeight: 200,
    color: "white",
  }
});
