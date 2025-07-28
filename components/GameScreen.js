import react, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Animated,
  Easing,
  Text,
  StyleSheet,
  Pressable,
  View,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { easyAI, hardAI, mediumAI } from "./ai";

function GameScreen({ mode }, ref) {
  const [clicked, setClicked] = useState(
    Array(9)
      .fill(null)
      .map(() => ({
        color: "#4A585A",
        anim: new Animated.Value(1), // opacity: initially 1
      }))
  );
  const [lastclicked, setLastClicked] = useState(Array(9).fill("#4A585A"));
  const [playerChoices, setPlayerChoices] = useState(
    Array(9).fill("not played")
  );
  const [gameStatus, setGameStatus] = useState(true);
  const [player, setPlayer] = useState("second");
  const [playKind, setPlayKind] = useState(0);
  const [player2Name, setPlayer2Name] = useState("Player 2");

  const [modernFirstMoves, setModernFirstMoves] = useState([]);
  const [modernSecondMoves, setModernSecondMoves] = useState([]);

  const playKindOrder = ["human", "easy AI", "medium AI", "hard AI"];

  function changePlaykind() {
    setPlayKind((prev) => {
      prev++;
      if (prev > 3) {
        prev = 0;
      }
      return prev;
    });
    if (playKind == 3) {
      setPlayer2Name("Player 2");
    } else {
      setPlayer2Name("AI");
    }
    resetGame();
  }

  function CheckWinner(choices) {
    //Rows
    for (let i = 0; i < 9; i += 3) {
      let ScoreX = 0;
      let ScoreO = 0;

      for (let j = i; j <= i + 2; j++) {
        if (choices[j] == "first") {
          ScoreX++;
        } else if (choices[j] == "second") {
          ScoreO++;
        }
        if (ScoreX > 0 && ScoreO > 0) {
          break;
        }
      }

      if (ScoreX == 3) {
        setGameStatus(false);
        return "second player";
      }
      if (ScoreO == 3) {
        setGameStatus(false);
        return "first player";
      }
    }

    //Columns
    for (let i = 0; i <= 2; i++) {
      let ScoreX = 0;
      let ScoreO = 0;

      for (let j = i; j < 9; j += 3) {
        if (choices[j] == "first") {
          ScoreX++;
        } else if (choices[j] == "second") {
          ScoreO++;
        }

        if (ScoreX > 0 && ScoreO > 0) {
          break;
        }
      }
      if (ScoreX == 3) {
        setGameStatus(false);
        return "second player";
      }

      if (ScoreO == 3) {
        setGameStatus(false);
        return "first player";
      }
    }

    //in X direction
    if (
      choices[0] == "first" &&
      choices[4] == "first" &&
      choices[8] == "first"
    ) {
      setGameStatus(false);
      return "second player";
    }

    if (
      choices[2] == "first" &&
      choices[4] == "first" &&
      choices[6] == "first"
    ) {
      setGameStatus(false);
      return "second player";
    }

    if (
      choices[0] == "second" &&
      choices[4] == "second" &&
      choices[8] == "second"
    ) {
      setGameStatus(false);
      return "first player";
    }

    if (
      choices[2] == "second" &&
      choices[4] == "second" &&
      choices[6] == "second"
    ) {
      setGameStatus(false);
      return "first player";
    }
    //Draw
    for (let i = 0; i < 9; i++) {
      if (choices[i] == "not played") {
        return "countine";
      }
    }
    setGameStatus(false);
    return "draw";
  }

  function handleClick(button) {
    // 1) Shallow‑clone each cell object so we can mutate safely
    const update = clicked.map((cell) => ({
      color: cell.color,
      anim: cell.anim,
    }));
    const updateLast = Array(9).fill("#4A585A");
    const updateChoice = [...playerChoices];

    // Quick debug
    console.log("Tapped:", button);

    // 2) Ignore taps on non‑empty cells
    if (update[button].color !== "#4A585A") return;

    // Helper to remove oldest move in modern mode
    const removeOldest = (movesArr, boardArr, choicesArr, playerColor) => {
      const newMoves = [...movesArr];

      // 🧹 If there are 3 moves, remove the oldest one (faded one)
      if (newMoves.length === 3) {
        const toRemove = newMoves.shift();

        // 🔄 Animate opacity to 0 (disappear), then reset color and choices
        Animated.timing(boardArr[toRemove].anim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          boardArr[toRemove].color = "#4A585A"; // Make it "empty"
          boardArr[toRemove].anim.setValue(1); // Reset opacity for future use
          choicesArr[toRemove] = "not played";
        });
      }

      // 🎨 Restore all current player's other pieces to full opacity
      for (let i = 0; i < 9; i++) {
        if (
          boardArr[i].color === playerColor &&
          boardArr[i].anim.__getValue() !== 1
        ) {
          Animated.timing(boardArr[i].anim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      }

      // 🔍 Fade the new oldest piece if 2 marks exist
      const updatedMoves = [...newMoves];
      if (updatedMoves.length === 2) {
        const toFade = updatedMoves[0];
        Animated.timing(boardArr[toFade].anim, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }

      return newMoves;
    };

    if (player === "second") {
      // ✅ Player 2's move
      let m2 = [...modernSecondMoves];
      if (mode === "modern") {
        m2 = removeOldest(m2, update, updateChoice, "#48BD7D");
        // Add current move to the array
        m2.push(button);
        setModernSecondMoves(m2);
      }

      // place Player 2's mark
      update[button].anim.setValue(1);
      update[button].color = "#48BD7D";
      updateLast[button] = "#48BD7D";
      updateChoice[button] = "second";

      // commit state
      setClicked(update);
      setLastClicked(updateLast);
      setPlayerChoices(updateChoice);

      // check for win/draw
      const r1 = CheckWinner(updateChoice);
      if (r1 !== "countine") {
        setPlayer(r1);
        return;
      }

      // ✅ AI turn (if any)
      if (playKind !== 0) {
        setTimeout(() => {
          const aiBoard = update.map((c) => ({ color: c.color, anim: c.anim }));
          const aiLast = Array(9).fill("#4A585A");
          const aiChoices = [...updateChoice];

          // pick AI move
          let aiMove =
            playKind === 1
              ? easyAI(aiChoices)
              : playKind === 2
              ? mediumAI(aiChoices)
              : hardAI(aiChoices);

          // handle modern removal for AI (Player 1)
          let m1 = [...modernFirstMoves];
          if (mode === "modern") {
            m1 = removeOldest(m1, aiBoard, aiChoices, "#EA4934");
            // Add AI move to the array
            m1.push(aiMove);
            setModernFirstMoves(m1);
          }

          // place AI's mark
          aiBoard[aiMove].anim.setValue(1);
          aiBoard[aiMove].color = "#EA4934";
          aiLast[aiMove] = "#EA4934";
          aiChoices[aiMove] = "first";

          // commit AI state
          setClicked(aiBoard);
          setLastClicked(aiLast);
          setPlayerChoices(aiChoices);

          // check AI win/draw
          const r2 = CheckWinner(aiChoices);
          if (r2 !== "countine") {
            setPlayer("AI");
          } else {
            setPlayer("second");
          }
        }, 500);
      } else {
        // no AI, pass turn back to Player 1
        setPlayer("first");
      }
    } else {
      // ✅ Player 1 (human) turn
      let m1 = [...modernFirstMoves];
      if (mode === "modern") {
        m1 = removeOldest(m1, update, updateChoice, "#EA4934");
        // Add current move to the array
        m1.push(button);
        setModernFirstMoves(m1);
      }

      // place Player 1's mark
      update[button].anim.setValue(1);
      update[button].color = "#EA4934";
      updateLast[button] = "#EA4934";
      updateChoice[button] = "first";

      setClicked(update);
      setLastClicked(updateLast);
      setPlayerChoices(updateChoice);

      const r3 = CheckWinner(updateChoice);
      if (r3 !== "countine") {
        setPlayer(r3);
      } else {
        setPlayer("second");
      }
    }
  }

  useImperativeHandle(ref, () => ({
    resetGame,
  }));

  function resetGame() {
    setClicked(
      Array(9)
        .fill(null)
        .map(() => ({
          color: "#4A585A",
          anim: new Animated.Value(1),
        }))
    );
    setPlayer("second");
    setLastClicked(Array(9).fill("#4A585A"));
    setPlayerChoices(Array(9).fill("not played"));
    setGameStatus(true);
    // Clear modern moves arrays
    setModernFirstMoves([]);
    setModernSecondMoves([]);
  }

  const renderItem = ({ item, index }) => (
    <Pressable
      onPress={() => handleClick(index)}
      style={[styles.square, { borderColor: lastclicked[index] }]}
    >
      <Animated.View style={{ opacity: clicked[index].anim }}>
        {clicked[index].color === "#EA4934" && (
          <MaterialCommunityIcons
            name="circle-outline"
            size={54}
            color="#FF4C4C"
          />
        )}
        {clicked[index].color === "#48BD7D" && (
          <MaterialCommunityIcons name="close" size={54} color="#00FF99" />
        )}
      </Animated.View>
    </Pressable>
  );

  return (
    <>
      <View style={{ marginTop: 50 }}>
        {gameStatus ? (
          <>
            <FlatList
              data={clicked}
              renderItem={renderItem}
              keyExtractor={(_, index) => index.toString()}
              numColumns={3}
              contentContainerStyle={{ gap: 0 }}
              style={{ flexGrow: 0 }}
            />
            <View
              style={{
                flexDirection: "row",
                marginVertical: 20,
                justifyContent: "space-around",
              }}
            >
              <View>
                <MaterialCommunityIcons
                  name="close"
                  size={54}
                  color="#C0C7D0"
                />
                <Text style={{ color: "#C0C7D0" }}>Player 1</Text>
              </View>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <MaterialCommunityIcons
                  name="circle-outline"
                  size={54}
                  color="#C0C7D0"
                />
                <Text
                  style={{
                    color: "#C0C7D0",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {player2Name}
                </Text>
              </View>
            </View>
            <View style={{ alignItems: "center" }}>
              <Pressable onPress={changePlaykind} style={styles.Button}>
                <Text style={styles.ButtonText}>
                  Play againt {playKindOrder[playKind]}
                </Text>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <Text style={{ color: "white", textAlign: "center" }}>
              {player}
            </Text>
            <Pressable onPress={resetGame} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>Play Again</Text>
            </Pressable>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  square: {
    width: 75,
    height: 75,
    borderColor: "#4A585A",
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  Button: {
    borderColor: "#6A8D8A",
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 5,
    marginHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 38,
    width: "80%",
    marginTop: 10,
    backgroundColor: "#152C2E",
  },
  ButtonText: {
    fontSize: 13,
    fontWeight: 200,
    color: "white",
  },
  headerButton: {
    borderColor: "#6A8D8A",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 5,
    alignContent: "center",
    justifyContent: "center",
    marginVertical: 15,
    height: 32,
  },
  headerButtonText: {
    fontSize: 13,
    fontWeight: 200,
    color: "white",
  },
});

export default forwardRef(GameScreen);
