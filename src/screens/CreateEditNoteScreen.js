import { View, Text, StyleSheet, TextInput } from "react-native";

import ReusableNavHeader from "../components/ReusableNavHeader";
import { globalStyles, inputStyles } from "../styles/globalStyles";
import { scale, verticalScale } from "react-native-size-matters";
import font from "../fonts/fonts";
import colors from "../theme";
import { useNavigation } from "@react-navigation/native";

export default function CreateEditNoteScreen() {
  const navigation = useNavigation();

  return (
    <>
      <ReusableNavHeader
        saveBtn={true}
        editBtn={false}
        onPress={() => navigation.goBack()}
      />
      <View style={[globalStyles.screenContainer, styles.container]}>
        <TextInput
          placeholder="Title"
          placeholderTextColor="#CCCCCC"
          style={styles.titleInput}
        />
        <TextInput
          placeholder="Type something..."
          placeholderTextColor="#CCCCCC"
          multiline={true}
          style={styles.contentInput}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    paddingHorizontal: scale(20),
    gap: 10,
  },
  titleInput: {
    width: "100%",
    fontSize: 48,
    fontFamily: font.primaryFontFamily,
    color: colors.primaryText,
  },
  contentInput: {
    fontSize: 23,
    width: "100%",
    height: verticalScale(300),
    flexGrow: 1,
    textAlignVertical: "top",
    color: colors.primaryText,
  },
});
