import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  Image,
} from "react-native";
import { verticalScale, scale } from "react-native-size-matters";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import colors from "../theme/index";
import fonts from "../fonts/fonts";
import images from "../images/images";
import navigationStrings from "../constants/navigationStrings";
import { useNavigation } from "@react-navigation/native";

export default function HeaderHome() {
  const navigation = useNavigation();
  return (
    <>
      <StatusBar
        barStyle="default"
        backgroundColor={colors.primaryBackground}
      />
      <View style={styles.container}>
        <Text style={styles.headerText}>Notes</Text>
        <Pressable
          style={styles.headerBtn}
          onPress={() => navigation.navigate(navigationStrings.SEARCH_NOTE)}
        >
          <Image source={images.searchBtn} style={styles.img} />
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
    paddingBottom: scale(10),
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
  img: {
    width: 24,
    height: 24,
    color: "#fff",
  },
});
