import { View, Text, StyleSheet, TextInput, Alert } from "react-native";

import ReusableNavHeader from "../components/ReusableNavHeader";
import { globalStyles, inputStyles } from "../styles/globalStyles";
import { scale, verticalScale } from "react-native-size-matters";
import font from "../fonts/fonts";
import colors from "../theme";
import { useNavigation, useRoute } from "@react-navigation/native";
import NotesAPI from "../services/api";
import { useEffect, useState } from "react";

export default function CreateEditNoteScreen() {
  const navigation = useNavigation();
  const routes = useRoute();

  const [noteSaved, SetnoteSaved] = useState(false);

  const { note, noteId, isEditing } = routes.params;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  console.log(title, description);

  // 🔥 Update your existing handleSave function to be async
  async function handleSave() {
    try {
      // Validate inputs
      if (!title.trim()) {
        Alert.alert("Error", "Please enter a title");
        return;
      }

      if (!isEditing) {
        // Creating new note
        const newNote = await NotesAPI.createNote(title, description);
        console.log("Created Note successfully!", newNote);
      } else {
        // // Updating existing note
        // const updatedNote = await NotesAPI.updateNote(
        //   noteId,
        //   title,
        //   description
        // );
        // console.log("Updated Note successfully!", updatedNote);

        console.log("this route is yet to be implemented!");
      }

      SetnoteSaved(true);
      Alert.alert("Success", "Note saved successfully!");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save note. Please try again.");
    }
  }

  function handleBack() {
    if (noteSaved) {
      // note is saved , user can go back
      navigation.goBack();
    } else {
      // user must save note before

      Alert.alert(
        "Unsaved Changes",
        "You have unsaved changes. What whould u like to do?",
        [
          {
            text: "Discard",
            style: "destructive",
            onPress: () => {
              console.log("Changes discarded");
              navigation.goBack();
            },
          },
          {
            text: "Save",
            style: "default",
            onPress: () => {
              handleSaveAndGoBack();
            },
          },
          {
            text: "Cancel",
            style: "cancel", // Default cancel button
            onPress: () => console.log("User cancelled"),
          },
        ],
        { cancelable: true } // Android: allow tapping outside to cancel
      );
    }
  }

  async function handleSaveAndGoBack() {
    try {
      if (!title.trim()) {
        Alert.alert("Error", "Please enter a title before saving");
        return;
      }

      if (!isEditing) {
        // Creating new note
        await NotesAPI.createNote(title, description);
        console.log("Created Note successfully!");
      } else {
        // Updating existing note

        console.log("this route this yet to be implemented! (update note)");
      }

      SetnoteSaved(true);
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save note. Please try again.");
    }
  }

  return (
    <>
      <ReusableNavHeader
        saveBtn={true}
        editBtn={false}
        onPressBack={() => handleBack()}
        onPressSave={() => handleSave()}
      />
      <View style={[globalStyles.screenContainer, styles.container]}>
        <TextInput
          placeholder="Title"
          placeholderTextColor="#CCCCCC"
          style={styles.titleInput}
          onChangeText={(noteTitle) => setTitle(noteTitle)}
          defaultValue={note?.title || title}
        />
        <TextInput
          placeholder="Type something..."
          placeholderTextColor="#CCCCCC"
          multiline={true}
          style={styles.contentInput}
          onChangeText={(noteDescription) => setDescription(noteDescription)}
          defaultValue={note?.description || description}
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
