import { StatusBar } from 'expo-status-bar';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import GameScreen from './components/GameScreen';
import { useRef, useState } from 'react';

export default function App() {
  const [mode, setMode] = useState(null);
  const gameRef = useRef();

  const handleReset = () => {
    gameRef.current?.resetGame();
  }

  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container}>
        {mode === null ? (
          // Mode Selection Screen
          <View style={styles.modeSelectionContainer}>
            <Text style={styles.modeText}>Choose Game Mode</Text>
            <Pressable style={styles.modeButton} onPress={() => setMode('classic')}>
              <Text style={styles.modeButtonText}>Classic</Text>
            </Pressable>
            <Pressable style={styles.modeButton} onPress={() => setMode('modern')}>
              <Text style={styles.modeButtonText}>Modern (3 marks)</Text>
            </Pressable>
          </View>
        ) : (
          // Game Screen
          <>
            <View style={styles.header}>
              <View>
                <Text style={styles.headerText}>TicTacNow</Text>
                <Text style={styles.headerText}>(XO) Game - {mode}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Pressable onPress={handleReset} style={styles.headerButton}>
                  <Text style={styles.headerButtonText}>Reset</Text>
                </Pressable>
                <Pressable style={styles.headerButton} onPress={() => setMode(null)}>
                  <Text style={styles.headerButtonText}>Back</Text>
                </Pressable>
              </View>
            </View>
            <GameScreen ref={gameRef} mode={mode} />
          </>
        )}
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
  },
    modeSelectionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  modeText: {
    fontSize: 22,
    color: 'white',
    marginBottom: 30,
  },
  modeButton: {
    backgroundColor: '#1E2D3D',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginVertical: 10,
    borderColor: '#6A8D8A',
    borderWidth: 1,
  },
  modeButtonText: {
    fontSize: 16,
    color: 'white',
  },
});
