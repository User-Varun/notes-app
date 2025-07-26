import { View, Text, StyleSheet, Image, SafeAreaView } from "react-native";

import HeaderHome from "../components/HeaderHome";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import CreateNoteBtn from "../components/CreateNoteBtn";

import colors from "../colors/colors";
import fonts from "../fonts/fonts";

export default function HomeScreenEmpty() {
  return (
    <View style={styles.container}>
      <HeaderHome />
      <View style={styles.imgContainer}>
        <Image
          source={require("../../assets/empty-homeScreen.png")}
          style={styles.img}
        />
        <Text style={styles.imgText}>Create your first note !</Text>
      </View>
      <CreateNoteBtn />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: verticalScale(20),
    backgroundColor: colors.primaryBackground,
    position: "relative",
  },
  imgContainer: {
    paddingTop: scale(150),
    alignItems: "center",
    justifyContent: "center",
    gap: scale(5),
  },
  img: {
    width: scale(320),
    height: scale(245),
    resizeMode: "contain",
    backgroundColor: "transparent",
  },
  imgText: { color: "#fff", fontFamily: fonts.primaryFontFamily, fontSize: 20 },
});
