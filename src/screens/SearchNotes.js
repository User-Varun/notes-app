import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { scale } from "react-native-size-matters";
import images from "../images/images";

import colors from "../theme";
import font from "../fonts/fonts";

export default function SearchNotes() {
  return (
    <View style={[globalStyles.screenContainer, styles.container]}>
      <View style={styles.searchBarContainer}>
        <TextInput
          placeholder="Search by the keyword..."
          style={styles.textInputEl}
          placeholderTextColor={colors.secondaryText}
        />
        <Pressable>
          <Image source={images.closeBtn} style={{ width: 24 }} />
        </Pressable>
      </View>
      <View style={styles.searchResultsContainer}>
        <Text style={{ color: "#fff" }}>
          All search output result will show up here!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    gap: scale(10),
  },
  searchBarContainer: {
    flexDirection: "row",
    gap: scale(10),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.secondaryBackground,
    paddingHorizontal: scale(15),
    borderRadius: scale(30),
  },
  textInputEl: {
    flexGrow: 3,
    fontSize: 20,
    fontFamily: font.primaryFontFamily,
    color: "#cccccc",
  },
  searchResultsContainer: {
    flexGrow: 1,
    width: "100%",
  },
});
