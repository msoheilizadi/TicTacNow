import react from "react";
import { Text, StyleSheet, Pressable, View } from "react-native";

function GameScreen() {
    return (
        <>
            <View style={{marginTop: 20, flexDirection: "row"}}>
                <Pressable style={styles.square}></Pressable>
                <Pressable style={styles.square}></Pressable>
                <Pressable style={styles.square}></Pressable>
            </View>
            <View style={{ flexDirection: "row"}}>
                <Pressable style={styles.square}></Pressable>
                <Pressable style={styles.square}></Pressable>
                <Pressable style={styles.square}></Pressable>
            </View>
            <View style={{ flexDirection: "row"}}>
                <Pressable style={styles.square}></Pressable>
                <Pressable style={styles.square}></Pressable>
                <Pressable style={styles.square}></Pressable>
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
    }
})

export default GameScreen;