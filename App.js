import { StatusBar } from 'expo-status-bar';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import GameScreen from './components/GameScreen';
import { useRef } from 'react';

export default function App() {
  const gameRef = useRef();

  const handleReset = () => {
    gameRef.current?.resetGame();
  }

  return (
    <>
    <StatusBar style="light" />
      <SafeAreaView style={styles.container}>
        <View style={{ flexDirection: "row"}}>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerText}>TicTacNow </Text>
              <Text style={styles.headerText}>(XO) Game </Text>
            </View>
            <View style={{ flexDirection: "row"}}>
              <Pressable onPress={handleReset} style={styles.headerButton}><Text style={styles.headerButtonText}>Reset</Text></Pressable>
              <Pressable style={styles.headerButton}><Text style={styles.headerButtonText}>about</Text></Pressable>
            </View>
          </View>
        </View>
        <View><GameScreen ref={gameRef}></GameScreen></View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010518',
    alignItems: 'center',
    paddingTop: 50
  },
  headerText: {
    fontSize: 14,
    fontWeight: 600,
    color: "white",
    marginHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: "20"
  },
  headerButton: {
    borderColor: "#6A8D8A",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 5,
    marginHorizontal: 8,
    alignContent: "center",
    justifyContent: "center",
    height: 32
  },
  headerButtonText: {
    fontSize: 13,
    fontWeight: 200,
    color: "white",
  }
});
