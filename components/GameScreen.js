import react, {forwardRef, useImperativeHandle, useState} from "react";
import { Text, StyleSheet, Pressable, View, FlatList } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';


function GameScreen(props, ref) {
    const [clicked, setClicked] = useState(Array(9).fill("#4A585A"));
    const [lastclicked, setLastClicked] = useState(Array(9).fill("#4A585A"));
    const [playerChoices, setPlayerChoices] = useState(Array(9).fill("not played"));
    const [gameStatus, setGameStatus] = useState(true);
    const [player, setPlayer] = useState("second");

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
                return "first player"
            }
            if (ScoreO == 3) {
                setGameStatus(false);    
                return "second player"
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

            console.log(ScoreX, ScoreO);
            

            if (ScoreX == 3) {
                setGameStatus(false);
                return "first player"
            }

            if (ScoreO == 3) {
                setGameStatus(false);
                return "second player"
            }
        }
        
        //in X direction
        if (choices[0] == "first" && choices[4] == "first" && choices[8] == "first"){
            setGameStatus(false);
            return "first player"
        }

        if (choices[2] == "first" && choices[4] == "first" && choices[6] == "first"){
            setGameStatus(false);
            return "first player"
        }

        if (choices[0] == "second" && choices[4] == "second" && choices[8] == "second"){
            setGameStatus(false);
            return "second player"
        }

        if (choices[2] == "second" && choices[4] == "second" && choices[6] == "second"){
            setGameStatus(false);
            return "second player"
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
            if (player == "first") {
                update[button] = "#EA4934";
                updatLastClick[button] = "#EA4934";
                updateChoice[button] = "first";
                setPlayer("second");
            }
            else {
                update[button] = "#48BD7D";
                updatLastClick[button] = "#48BD7D";
                updateChoice[button] = "second";
                setPlayer("first");
            }
            setClicked(update);
            setLastClicked(updatLastClick);
            setPlayerChoices(updateChoice);
        }
        if (CheckWinner(updateChoice) != "countine") {
            setPlayer(CheckWinner(updateChoice))
        }
        
    }

    useImperativeHandle(ref, () => ({
        resetGame
    }))

    function resetGame() {
        setClicked(Array(9).fill("#4A585A"));
        setPlayer("first");
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
                    <View style={{flexDirection: "row",marginTop: 10, justifyContent: "space-around"}}>
                        <View>
                                <MaterialCommunityIcons name="close" size={54} color="#C0C7D0" />
                                <Text style={{color: "#C0C7D0"}}>Player 1</Text>
                        </View>
                        <View>
                                <MaterialCommunityIcons name="circle-outline" size={54} color="#C0C7D0" />
                                <Text style={{color: "#C0C7D0"}}>Player 2</Text>
                        </View>
                        </View>
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
})

export default forwardRef(GameScreen);