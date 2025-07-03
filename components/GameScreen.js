import react, {useState} from "react";
import { Text, StyleSheet, Pressable, View, FlatList } from "react-native";

function GameScreen() {
    const [clicked, setClicked] = useState(Array(9).fill("white"));
    const [player, setPlayer] = useState("first"); 

    function handleClick(button) {
        const update = [...clicked];
        if (player == "first") {
            update[button] = "red";
            setPlayer("second");
        }
        else {
            update[button] = "green";
            setPlayer("first");
        }
        setClicked(update);
    }

    const renderItem = ({item, index}) => (
        <Pressable 
            onPress={() => handleClick(index)}
            style={[
                styles.square,
                {backgroundColor: clicked[index]}
            ]}
        />
    )

    return (
        <>
            <View style={{marginTop: 30}}>
                <FlatList
                    data={clicked}
                    renderItem={renderItem}
                    keyExtractor={(_,index) => index.toString()}
                    numColumns={3}
                    contentContainerStyle={{gap: 0}}
                />
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
        marginHorizontal: 5
    },
    clickedSquare: {
        backgroundColor: "#4ebf7e"
    },
    grid: {

    }
})

export default GameScreen;