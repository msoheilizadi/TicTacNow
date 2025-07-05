import react, {forwardRef, useImperativeHandle, useState} from "react";
import { Text, StyleSheet, Pressable, View, FlatList } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { easyAI } from "./ai";

function GameScreen(props, ref) {
    const [clicked, setClicked] = useState(Array(9).fill("#4A585A"));
    const [lastclicked, setLastClicked] = useState(Array(9).fill("#4A585A"));
    const [playerChoices, setPlayerChoices] = useState(Array(9).fill("not played"));
    const [gameStatus, setGameStatus] = useState(true);
    const [player, setPlayer] = useState("second");
    const [playKind, setPlayKind] = useState(0);
    const [player2Name, setPlayer2Name] = useState("Player 2");

    const playKindOrder = ["human", "easy AI", "medium AI", "hard AI"];

    function changePlaykind() {        
        setPlayKind((prev) => {
            prev++;
            if (prev > 3) {
                prev = 0
            }
            return prev
        })
        if (playKind == 3){
            setPlayer2Name("Player 2")
        }
        else {
            setPlayer2Name("AI")
        }
        resetGame();
    }

    function CheckWinner(choices) {
        //Rows
        for (let i = 0; i < 9 ; i += 3) {
            let ScoreX = 0;
            let ScoreO = 0;

            for (let j = i; j <= i + 2; j++) {
                if (choices[j] == "first") {
                    ScoreX++
                }
                else if (choices[j] == "second") {
                    ScoreO++
                }
                if (ScoreX > 0 && ScoreO > 0) {
                    break
                }
            }

            if (ScoreX == 3) {
                setGameStatus(false);
                return "second player"
            }
            if (ScoreO == 3) {
                setGameStatus(false);    
                return "first player"
            }
        }
        
        //Columns
        for (let i = 0; i <= 2; i++) {
            let ScoreX = 0;
            let ScoreO = 0;

            for (let j = i; j < 9; j += 3) {
                if (choices[j] == "first") {
                    ScoreX++
                }

                else if (choices[j] == "second") {
                    ScoreO++
                }

                if (ScoreX > 0 && ScoreO > 0) {
                    break
                }
            }            
            if (ScoreX == 3) {
                setGameStatus(false);
                return "second player"
            }

            if (ScoreO == 3) {
                setGameStatus(false);
                return "first player"
            }
        }
        
        //in X direction
        if (choices[0] == "first" && choices[4] == "first" && choices[8] == "first"){
            setGameStatus(false);
            return "second player"
        }

        if (choices[2] == "first" && choices[4] == "first" && choices[6] == "first"){
            setGameStatus(false);
            return "second player"
        }

        if (choices[0] == "second" && choices[4] == "second" && choices[8] == "second"){
            setGameStatus(false);
            return "first player"
        }

        if (choices[2] == "second" && choices[4] == "second" && choices[6] == "second"){
            setGameStatus(false);
            return "first player"
        }
        //Draw
        for (let i = 0; i < 9; i++) {
            if (choices[i] == "not played") {
                return "countine"
            }
        }
        setGameStatus(false);
        return "draw"
    }
    

    function handleClick(button) {
        const update = [...clicked];
        const updatLastClick = Array(9).fill("#4A585A");
        const updateChoice = [...playerChoices];

        
        if (update[button] == "#4A585A"){
            if (player == "second") {
                update[button] = "#48BD7D";
                updatLastClick[button] = "#48BD7D";
                updateChoice[button] = "second";

                setClicked(update);
                setLastClicked(updatLastClick);
                setPlayerChoices(updateChoice);

                console.log(playKind);

                const result = CheckWinner(updateChoice);
                if (result != "countine") {
                    setPlayer(result)
                }
                
                else if (playKind != 0) {
                    setTimeout(() => {

                        const aiClicked = [...update];
                        const aiLastClick = Array(9).fill("#4A585A");
                        const aiChoices = [...updateChoice];

                        const asnwerAI = easyAI(updateChoice);
                        
                        aiClicked[asnwerAI] = "#EA4934";
                        aiLastClick[asnwerAI] = "#EA4934";
                        aiChoices[asnwerAI] = "first";

                        setClicked(aiClicked);
                        setLastClicked(aiLastClick);
                        setPlayerChoices(aiChoices);

                        const result = CheckWinner(aiChoices);
                        if (result !== "countine") {
                            setPlayer("AI");
                        }
                    },500)
                }
                else {
                    setPlayer("first")
                }
 
            }
            else {
                update[button] = "#EA4934";
                updatLastClick[button] = "#EA4934";
                updateChoice[button] = "first";

                setClicked(update);
                setLastClicked(updatLastClick);
                setPlayerChoices(updateChoice);

                const result = CheckWinner(updateChoice);
                if (result !== "countine") {
                    setPlayer(result);
                } else {
                    setPlayer("second");
                }
            }
        }
    }

    useImperativeHandle(ref, () => ({
        resetGame
    }))

    function resetGame() {
        setClicked(Array(9).fill("#4A585A"));
        setPlayer("second");
        setLastClicked(Array(9).fill("#4A585A"));
        setPlayerChoices(Array(9).fill("not played"));
        setGameStatus(true);
    }

    const renderItem = ({item, index}) => (
        <Pressable 
            onPress={() => handleClick(index)}
            style={[
                styles.square,
                {borderColor: lastclicked[index]}
            ]}
        >
            {clicked[index] == "#EA4934" && (
                <MaterialCommunityIcons name="circle-outline" size={54} color="#FF4C4C" />
            )}
            {clicked[index] == "#48BD7D" && (
                <MaterialCommunityIcons name="close" size={54} color="#00FF99" />
            )}
        </Pressable>
    )

    return (
        <>
            <View style={{marginTop: 50}}>
                {gameStatus ? ( 
                <>
                    <FlatList
                        data={clicked}
                        renderItem={renderItem}
                        keyExtractor={(_,index) => index.toString()}
                        numColumns={3}
                        contentContainerStyle={{gap: 0}}
                        style={{flexGrow: 0}}
                    />
                    <View style={{flexDirection: "row",marginVertical: 20, justifyContent: "space-around"}}>
                        <View>
                                <MaterialCommunityIcons name="close" size={54} color="#C0C7D0" />
                                <Text style={{color: "#C0C7D0"}}>Player 1</Text>
                        </View>
                        <View style={{justifyContent: "center", alignItems: "center"}}>
                                <MaterialCommunityIcons name="circle-outline" size={54} color="#C0C7D0" />
                                <Text style={{color: "#C0C7D0", justifyContent: "center", alignItems: "center"}}>{player2Name}</Text>
                        </View>
                    </View>
                    <View style={{ alignItems:"center"}}><Pressable onPress={changePlaykind} style={styles.Button}><Text style={styles.ButtonText}>Play againt {playKindOrder[playKind]}</Text></Pressable></View>
                    
                </>) : (
                    <Text style={{color: "white"}}>{player}</Text>
                )}
            
            </View>
        </>
    )
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
        alignItems: "center"
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
        backgroundColor: "#152C2E"
    },
    ButtonText: {
        fontSize: 13,
        fontWeight: 200,
        color: "white",
    }
})

export default forwardRef(GameScreen);