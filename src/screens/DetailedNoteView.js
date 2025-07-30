import { View, Text, StyleSheet } from "react-native";
import ReusableNavHeader from "../components/ReusableNavHeader";
import { globalStyles } from "../styles/globalStyles";
import { scale } from "react-native-size-matters";
import { useNavigation, useRoute } from "@react-navigation/native";
import colors from "../theme";

import navigationStrings from "../constants/navigationStrings";

export default function DetailedNoteView() {
  const navigation = useNavigation();
  const route = useRoute();

  // note data from route params
  const { note, noteId } = route.params;

  function handleEdit() {
    // Navigate to createEdit screen with note data
    navigation.navigate(navigationStrings.CREATE_EDIT, {
      note,
      noteId,
      isEditing: true,
    });
  }

  return (
    <View style={[globalStyles.screenContainer, styles.container]}>
      <ReusableNavHeader
        saveBtn={false}
        editBtn={true}
        onPressBack={() => navigation.goBack()}
        onPressEdit={() => handleEdit()}
      />
      <View style={styles.notesContainer}>
        <Text style={styles.title}>{note?.title || "No Title"}</Text>
        <Text style={styles.description}>
          {note?.description || "No Description"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: scale(15),
  },
  notesContainer: {
    width: "100%",
    flexGrow: 1,
    paddingHorizontal: scale(20),
    color: colors.primaryText,
    gap: scale(20),
  },
  description: {
    flexGrow: 1,
    color: "#fff",
    fontSize: scale(21),
    fontFamily: "Nunito",
    fontWeight: "100",
  },
  title: {
    color: "#fff",
    fontSize: scale(32),
    fontFamily: "Nunito",
    fontWeight: "800",
  },
});
