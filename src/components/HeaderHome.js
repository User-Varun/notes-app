import { View, Text, StyleSheet, Pressable, StatusBar } from "react-native";
import { verticalScale, scale } from "react-native-size-matters";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import colors from "../colors/colors";
import fonts from "../fonts/fonts";

export default function HeaderHome() {
  return (
    <>
      <StatusBar
        barStyle="default"
        backgroundColor={colors.primaryBackground}
      />
      <View style={styles.container}>
        <Text style={styles.headerText}>Notes</Text>
        <Pressable style={styles.headerBtn}>
          <FontAwesome name="search" size={24} color="white" />
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // height: verticalScale(40),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(25),
  },
  headerBtn: {
    color: "#fff",
    width: scale(50),
    height: scale(50),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.btnBackground,
    borderRadius: scale(15),
    // padding: scale(20),
  },
  headerText: {
    color: "#fff",
    fontSize: 43,
    fontWeight: "500",
    fontFamily: fonts.primaryFontFamily,
  },
});
