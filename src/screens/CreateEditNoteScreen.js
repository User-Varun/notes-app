import { View, StyleSheet, TextInput, Alert } from "react-native";
import ReusableNavHeader from "../components/ReusableNavHeader";
import { globalStyles, inputStyles } from "../styles/globalStyles";
import { scale, verticalScale } from "react-native-size-matters";
import font from "../fonts/fonts";
import colors from "../theme";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import NotesAPI from "../services/api";
import React, { useEffect, useState } from "react";

export default function CreateEditNoteScreen() {
  const navigation = useNavigation();
  const routes = useRoute();

  const [noteSaved, SetnoteSaved] = useState(false);

  const { note, isEditing, noteId } = routes.params;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // 🔥 Handle hardware back button (Android) and swipe back (iOS)
  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = navigation.addListener("beforeRemove", (e) => {
        // Check if we should prevent navigation
        const hasChanges =
          title.trim().length > 0 || description.trim().length > 0;

        if (!hasChanges || noteSaved) {
          // Allow navigation if no changes or already saved
          return;
        }

        // Prevent default behavior only when we have unsaved changes
        e.preventDefault();

        // Show the alert
        Alert.alert(
          "Unsaved Changes",
          "You have unsaved changes. What would you like to do?",
          [
            {
              text: "Discard",
              style: "destructive",
              onPress: () => {
                console.log("Changes discarded");
                // Allow navigation to proceed
                navigation.dispatch(e.data.action);
              },
            },
            {
              text: "Save",
              style: "default",
              onPress: async () => {
                // 🔥 Save and navigate inline to avoid double alerts
                try {
                  if (!title.trim()) {
                    Alert.alert("Error", "Please enter a title before saving");
                    return;
                  }

                  if (!isEditing) {
                    await NotesAPI.createNote(title, description);
                    console.log("Created Note successfully!");
                  } else {
                    await NotesAPI.updateNote(noteId, title, description);
                    console.log("Updated Note successfully!");
                  }

                  // 🔥 Navigate directly without triggering beforeRemove again
                  navigation.dispatch(e.data.action);
                } catch (err) {
                  console.error(err);
                  Alert.alert(
                    "Error",
                    "Failed to save note. Please try again."
                  );
                }
              },
            },
          ],
          { cancelable: true }
        );
      });

      return () => {
        unsubscribe();
      };
    }, [navigation, title, description, noteSaved])
  );

  async function handleSave() {
    try {
      // Validate inputs
      if (!title.trim() && !isEditing) {
        Alert.alert("Error", "Please enter a title");
        return;
      }

      if (!isEditing) {
        // Creating new note
        const newNote = await NotesAPI.createNote(title, description);
        console.log("Created Note successfully!", newNote);
      } else {
        const updatedNote = await NotesAPI.updateNote(
          noteId,
          title,
          description
        );
        console.log("Updated Note successfully!", updatedNote);
      }

      SetnoteSaved(true);
      Alert.alert("Success", "Note saved successfully!");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save note. Please try again.");
    }
  }

  function handleBack() {
    navigation.goBack(); // Let beforeRemove handle the alert
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

      // 🔥 Navigate back immediately - beforeRemove will see noteSaved as true
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save note. Please try again.");
    }
  }

  useEffect(() => {
    if (note && isEditing) {
      setTitle(note.title || "");
      setDescription(note.description || "");
    }
  }, [note, isEditing]);

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
          value={title}
        />
        <TextInput
          placeholder="Type something..."
          placeholderTextColor="#CCCCCC"
          multiline={true}
          style={styles.contentInput}
          onChangeText={(noteDescription) => setDescription(noteDescription)}
          value={description}
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
