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
import ConfirmModal from "../components/ConfirmModal";
import { createNote, updateNote } from "../services/sqlite-db";
import { useNotes } from "../hooks/useNotes";
import navigationStrings from "../constants/navigationStrings";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateEditNoteScreen() {
  const navigation = useNavigation();
  const routes = useRoute();

  const { addNote, updateNote, fetchNotes } = useNotes();
  const [noteSaved, SetnoteSaved] = useState(false);

  const { note, isEditing, noteId } = routes.params;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [unsavedVisible, setUnsavedVisible] = useState(false);
  const [pendingNavAction, setPendingNavAction] = useState(null);

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

        // Show styled modal instead, preserving options
        setPendingNavAction(e.data.action);
        setUnsavedVisible(true);
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
        // using local db to create Note instead of the api
        // const newNote = await NotesAPI.createNote(title, description);

        const newNote = await addNote(title, description);
        console.log("Created Note successfully!", newNote);

        // move to the home screen
        navigation.navigate(navigationStrings.EMPTYHOME);
      } else {
        // const updatedNote = await NotesAPI.updateNote(
        //   noteId,
        //   title,
        //   description
        // );

        const updatedNote = await updateNote(noteId, title, description);

        console.log("Updated Note successfully!", updatedNote);

        // move to the home screen
        navigation.navigate(navigationStrings.EMPTYHOME);
      }

      SetnoteSaved(true);

      console.log("Success", "Note saved successfully!");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save note. Please try again.");
    }
  }

  function handleBack() {
    // Refresh the notes list
    fetchNotes();
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
        // await NotesAPI.createNote(title, description);
        const result = await addNote(title, description);
        console.log("Created Note successfully!", result);
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
    <SafeAreaView style={[globalStyles.screenContainer]}>
      <ReusableNavHeader
        saveBtn={true}
        editBtn={false}
        onPressBack={() => handleBack()}
        onPressSave={() => handleSave()}
      />
      <View style={styles.container}>
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
      <ConfirmModal
        visible={unsavedVisible}
        title="Unsaved Changes"
        message="You have unsaved changes. What would you like to do?"
        deleteText="Discard"
        editText="Save"
        showCancel={false}
        onDelete={() => {
          // Discard changes and navigate
          setUnsavedVisible(false);
          if (pendingNavAction) navigation.dispatch(pendingNavAction);
          setPendingNavAction(null);
        }}
        onEdit={async () => {
          try {
            if (!title.trim()) {
              Alert.alert("Error", "Please enter a title before saving");
              return;
            }
            if (!isEditing) {
              const result = await addNote(title, description);
              console.log("Created Note successfully!", result);
            } else {
              const result = await updateNote(noteId, title, description);
              console.log("Updated Note successfully!", result);
            }
            setUnsavedVisible(false);
            if (pendingNavAction) navigation.dispatch(pendingNavAction);
            setPendingNavAction(null);
          } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to save note. Please try again.");
          }
        }}
        onCancel={() => {
          // no cancel button shown; keep for backdrop press safety
          setUnsavedVisible(false);
          setPendingNavAction(null);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
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
