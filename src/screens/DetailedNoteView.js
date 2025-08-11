import { View, Text, StyleSheet, ScrollView } from "react-native";
import ReusableNavHeader from "../components/ReusableNavHeader";
import { globalStyles } from "../styles/globalStyles";
import { scale } from "react-native-size-matters";
import { useNavigation, useRoute } from "@react-navigation/native";
import colors from "../theme";

import navigationStrings from "../constants/navigationStrings";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNotes } from "../hooks/useNotes";

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

  function handleGoBack() {
    navigation.navigate(navigationStrings.EMPTYHOME);
  }

  return (
    <SafeAreaView style={[globalStyles.screenContainer, styles.container]}>
      <View style={styles.inner}>
        <ReusableNavHeader
          saveBtn={false}
          editBtn={true}
          onPressBack={() => handleGoBack()}
          onPressEdit={() => handleEdit()}
        />
        <View style={styles.notesContainer}>
          <Text style={styles.title}>{note?.title || "No Title"}</Text>
          <ScrollView
            style={styles.descriptionScroll}
            contentContainerStyle={styles.descriptionContent}
            showsVerticalScrollIndicator={false}
            contentInset={{ bottom: scale(60) }} // iOS extra inset
            contentInsetAdjustmentBehavior="automatic"
            fadingEdgeLength={scale(30)} // Android nice fade top/bottom
            overScrollMode="always"
          >
            <Text style={styles.description}>
              {note?.description || "No Description"}
            </Text>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    gap: scale(15),
  },
  notesContainer: {
    width: "100%",
    flex: 1,
    paddingHorizontal: scale(20),
    color: colors.primaryText,
    gap: scale(20),
  },
  descriptionScroll: {
    flex: 1,
  },
  descriptionContent: {
    paddingBottom: scale(80), // ample space so last line not flush with screen edge
  },
  description: {
    color: "#fff",
    fontSize: scale(21),
    fontFamily: "Nunito",
    fontWeight: "100",
    lineHeight: scale(28),
  },
  title: {
    color: "#fff",
    fontSize: scale(32),
    fontFamily: "Nunito",
    fontWeight: "800",
  },
});
