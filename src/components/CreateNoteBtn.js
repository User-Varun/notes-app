import { View, Text, StyleSheet, Pressable, Image } from "react-native";

import { scale } from "react-native-size-matters";

export default function CreateNoteBtn() {
  return (
    <Pressable style={styles.container}>
      <View style={styles.imgContainer}>
        <Image source={require("../../assets/add.png")} style={styles.img} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: scale(30),
    right: scale(20),
  },
  imgContainer: {
    backgroundColor: "#b0b0b0ff",
    borderRadius: scale(32),
    alignItems: "center",
    justifyContent: "center",
    width: scale(64),
    height: scale(64),
  },
  img: {
    width: scale(48),
    height: scale(48),
    tintColor: "#fff",
  },
});
