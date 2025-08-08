import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";

import HeaderHome from "../components/HeaderHome";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import CreateNoteBtn from "../components/CreateNoteBtn";

import fonts from "../fonts/fonts";
import navigationStrings from "../constants/navigationStrings";
import { globalStyles } from "../styles/globalStyles";

import { useNotes } from "../hooks/useNotes";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import ConfirmModal from "../components/ConfirmModal";

// Fixed pastel palette (from screenshot) used for note cards
const CARD_BG_COLORS = [
  "#2E3036", // Slate
  "#2C2F33", // Graphite
  "#2A3138", // Deep Blue-Gray
  "#2B3230", // Charcoal Green
  "#302733", // Eggplant
  "#2B3438", // Steel Teal
];
const getCardColorByIndex = (i) => CARD_BG_COLORS[i % CARD_BG_COLORS.length];

export default function HomeScreenEmpty({ navigation }) {
  const { notes, loading, error, fetchNotes, removeNote } = useNotes();
  // Modal state must be declared before any early returns to obey Hooks rules
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  // show loading spinner (only for initial load)
  if (loading && notes.length === 0) {
    return (
      <View style={[globalStyles.screenContainer, styles.centered]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading notes...</Text>
      </View>
    );
  }

  // Show error message (only if no notes and there's an error)
  if (error && notes.length === 0) {
    return (
      <View style={[globalStyles.screenContainer, styles.centered]}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <CreateNoteBtn title="Retry" onPress={() => fetchNotes()} />
      </View>
    );
  }

  // Show empty state if no notes
  if (!notes || notes.length === 0) {
    return (
      <SafeAreaView style={[globalStyles.screenContainer]}>
        <View style={styles.container}>
          <HeaderHome />
          <ScrollView
            contentContainerStyle={styles.imgContainer}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={fetchNotes}
                colors={["#000000"]} // Black spinner for Android
                tintColor="#000000" // Black spinner for iOS
                title="Pull to refresh"
                titleColor="#000000"
                progressBackgroundColor="#ffffff"
              />
            }
          >
            <Image
              source={require("../assets/empty-homeScreen.png")}
              style={styles.img}
            />
            <Text style={[styles.imgText, { color: "#000" }]}>
              Create your first note !
            </Text>
          </ScrollView>
        </View>
        <CreateNoteBtn
          onPress={() =>
            navigation.navigate(navigationStrings.CREATE_EDIT, {
              isEditing: false, // 🔥 Always pass isEditing
              note: null, // 🔥 Pass null for new notes
              noteId: null, // 🔥 Pass null for new notes
            })
          }
        />
      </SafeAreaView>
    );
  }

  // 🔥 Handle long press on note: open confirm modal
  const handleLongPress = (note) => {
    setSelectedNote(note);
    setConfirmVisible(true);
  };

  // 🔥 Delete note function
  const handleDeleteNote = async (id) => {
    try {
      const result = await removeNote(id); // from useNote hook

      console.log("Note deleted successfully!", result);

      // Refresh the notes list
      fetchNotes();
    } catch (err) {
      console.error("Delete error:", err);
      Alert.alert("Error", "Failed to delete note. Please try again.");
    }
  };

  return (
    <SafeAreaView style={[globalStyles.screenContainer, styles.container]}>
      <View>
        <HeaderHome />
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(navigationStrings.DETAILED_NOTE, {
                  noteId: item.id,
                  note: item,
                })
              }
              // 🔥 Add long press handler
              onLongPress={() => handleLongPress(item)}
            >
              <View
                style={[
                  styles.noteCard,
                  // { backgroundColor: getCardColorByIndex(index) },
                  { backgroundColor: "#2C2F33" },
                ]}
              >
                <Text style={styles.noteTitle}>{item.title}</Text>
                <View style={styles.cardDivider} />

                <Text style={styles.notePreview}>
                  {item.description.length < 100
                    ? item.description
                    : item.description?.substring(0, 100) + "..."}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchNotes}
              colors={["#fff"]} // Android
              tintColor="#fff" // ios
              title="Pull to refresh"
              titleColor="#fff"
              progressBackgroundColor="black"
            />
          }
        />
      </View>
      <ConfirmModal
        visible={confirmVisible}
        message={
          selectedNote
            ? `What would you like to do with "${selectedNote.title}"?`
            : "What would you like to do?"
        }
        deleteText="Delete"
        editText="Edit"
        cancelText="Cancel"
        onDelete={async () => {
          if (selectedNote) await handleDeleteNote(selectedNote.id);
          setConfirmVisible(false);
          setSelectedNote(null);
        }}
        onEdit={() => {
          if (selectedNote)
            navigation.navigate(navigationStrings.CREATE_EDIT, {
              note: selectedNote,
              noteId: selectedNote.id,
              isEditing: true,
            });
          setConfirmVisible(false);
          setSelectedNote(null);
        }}
        onCancel={() => {
          setConfirmVisible(false);
          setSelectedNote(null);
        }}
      />
      <CreateNoteBtn
        onPress={() =>
          navigation.navigate(navigationStrings.CREATE_EDIT, {
            isEditing: false, // 🔥 Always pass isEditing
            note: null, // 🔥 Pass null for new notes
            noteId: null, // 🔥 Pass null for new notes
          })
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  imgContainer: {
    flexGrow: 1,
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
  imgText: {
    fontFamily: fonts.primaryFontFamily,
    fontSize: moderateScale(20), // Use moderateScale for consistency
    color: "#000",
  },

  loadingText: {
    color: "#fff",
    marginTop: 10,
  },
  errorText: {
    color: "#ff6b6b",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  listContainer: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: verticalScale(16),
    paddingBottom: scale(30),
  },
  noteCard: {
    // color applied dynamically per index
    borderRadius: scale(12),
    padding: scale(16),
    marginBottom: verticalScale(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noteTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: verticalScale(3),
  },
  cardDivider: {
    width: "100%",
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#535252ff",
    marginBottom: verticalScale(8),
    borderRadius: 1,
    opacity: 0.8,
  },
  notePreview: {
    color: "#bcbcbcff",
    fontSize: 14,
    lineHeight: 20,
  },

  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
});
