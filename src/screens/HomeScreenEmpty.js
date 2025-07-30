import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";

import HeaderHome from "../components/HeaderHome";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import CreateNoteBtn from "../components/CreateNoteBtn";

import fonts from "../fonts/fonts";
import navigationStrings from "../constants/navigationStrings";
import { globalStyles } from "../styles/globalStyles";

import { useNotes } from "../hooks/useNotes";

export default function HomeScreenEmpty({ navigation }) {
  const { notes, loading, error, fetchNotes } = useNotes();

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
      <View style={[globalStyles.screenContainer, styles.container]}>
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
              titleColor="#ffffff"
              progressBackgroundColor="#ffffff"
            />
          }
        >
          <Image
            source={require("../assets/empty-homeScreen.png")}
            style={styles.img}
          />
          <Text style={styles.imgText}>Create your first note !</Text>
        </ScrollView>
        <CreateNoteBtn
          onPress={() => navigation.navigate(navigationStrings.CREATE_EDIT)}
        />
      </View>
    );
  }

  return (
    <View style={[globalStyles.screenContainer, styles.container]}>
      <HeaderHome />
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.noteCard}>
            <Text
              style={styles.noteTitle}
              onPress={() =>
                navigation.navigate(navigationStrings.DETAILED_NOTE, {
                  noteId: item.id,
                  note: item,
                })
              }
            >
              {item.title}
            </Text>
            <Text style={styles.notePreview}>
              {item.description.length < 100
                ? item.description
                : item.description?.substring(0, 100) + "..."}
            </Text>
          </View>
        )}
        contentContainerStyle={[styles.listContainer]}
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

      <CreateNoteBtn
        onPress={() =>
          navigation.navigate(navigationStrings.CREATE_EDIT, {
            isEditing: false, // 🔥 Always pass isEditing
            note: null, // 🔥 Pass null for new notes
            noteId: null, // 🔥 Pass null for new notes
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
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
    color: "#fff",
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
    padding: 16,
  },
  noteCard: {
    backgroundColor: "#b83131ff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  noteTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  notePreview: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 20,
  },

  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
});
