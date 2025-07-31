import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { scale, verticalScale } from "react-native-size-matters";
import images from "../images/images";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import colors from "../theme";
import font from "../fonts/fonts";
import { useNotes } from "../hooks/useNotes";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import navigationStrings from "../constants/navigationStrings";

export default function SearchNotes() {
  const { notes, loading } = useNotes();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Filter notes based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredNotes([]);
      setIsSearching(false);
    } else {
      setIsSearching(true);

      // Add small delay for better UX
      const timeoutId = setTimeout(() => {
        const filtered = notes.filter(
          (note) =>
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredNotes(filtered);
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, notes]);

  const handleNotePress = (note) => {
    navigation.navigate(navigationStrings.DETAILED_NOTE, {
      noteId: note.id,
      note: note,
    });
  };

  const handleNoteLongPress = (note) => {
    // Add your long press handler here (delete/edit options)
    console.log("Long pressed note:", note.title);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredNotes([]);
  };
  const renderNoteItem = ({ item }) => (
    <TouchableOpacity
      style={styles.noteCard}
      onPress={() => handleNotePress(item)}
      onLongPress={() => handleNoteLongPress(item)}
    >
      <Text style={styles.noteTitle} numberOfLines={1}>
        {highlightSearchText(item.title, searchQuery)}
      </Text>
      <Text style={styles.notePreview} numberOfLines={2}>
        {highlightSearchText(
          item.description?.substring(0, 100) + "...",
          searchQuery
        )}
      </Text>
    </TouchableOpacity>
  );
  // Helper function to highlight search text
  const highlightSearchText = (text, query) => {
    if (!query.trim() || !text) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return (
      <Text>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <Text key={index} style={styles.highlightText}>
              {part}
            </Text>
          ) : (
            <Text key={index}>{part}</Text>
          )
        )}
      </Text>
    );
  };

  const renderEmptyState = () => {
    if (searchQuery.trim() === "") {
      return (
        <View style={styles.emptyState}>
          <FontAwesome name="search" size={60} color="#666" />
          <Text style={styles.emptyTitle}>Search Your Notes</Text>
          <Text style={styles.emptySubtitle}>
            Type in the search box to find notes by title or content
          </Text>
        </View>
      );
    }

    if (isSearching) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={colors.primaryText} />
          <Text style={styles.emptyTitle}>Searching...</Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyState}>
        <Image source={images.noteNotFound} />
        <Text style={styles.emptyTitle}>No Notes Found</Text>
        <Text style={styles.emptySubtitle}>
          Try searching with different keywords
        </Text>
      </View>
    );
  };

  return (
    <View style={[globalStyles.screenContainer, styles.container]}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by the keyword..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <FontAwesome name="times-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {/* Search Stats
      {searchQuery.trim() !== "" && !isSearching && (
        <Text style={styles.searchStats}>
          {filteredNotes.length} {filteredNotes.length === 1 ? "note" : "notes"}{" "}
          found
        </Text>
      )} */}
      {/* Search Results */}
      <View style={styles.resultsContainer}>
        {filteredNotes.length > 0 ? (
          <FlatList
            data={filteredNotes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderNoteItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          renderEmptyState()
        )}
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
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#2a2a2a",
    borderRadius: scale(12),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(12),
  },
  searchIcon: {
    marginRight: scale(12),
  },
  searchInput: {
    color: colors.primaryText,
    fontSize: scale(16),
    fontFamily: font.primaryFontFamily,
    flexGrow: 1,
  },
  clearButton: {
    marginLeft: scale(10),
    padding: scale(5),
  },
  searchStats: {
    color: "#666",
    fontSize: scale(14),
    fontFamily: font.primaryFontFamily,
    marginTop: verticalScale(10),
    textAlign: "center",
  },
  resultsContainer: {
    flex: 1,
  },
  listContainer: {
    padding: scale(20),
  },
  noteCard: {
    backgroundColor: "#2a2a2a",
    borderRadius: scale(12),
    padding: scale(16),
    marginBottom: verticalScale(12),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noteTitle: {
    color: colors.primaryText,
    fontSize: scale(18),
    fontFamily: font.primaryFontFamily,
    fontWeight: "600",
    marginBottom: verticalScale(8),
  },

  notePreview: {
    color: "#999",
    fontSize: scale(14),
    fontFamily: font.primaryFontFamily,
    lineHeight: scale(20),
    marginBottom: verticalScale(8),
  },
  noteDate: {
    color: "#666",
    fontSize: scale(12),
    fontFamily: font.primaryFontFamily,
  },
  highlightText: {
    backgroundColor: "#FFD700",
    color: "#000",
    fontWeight: "bold",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(40),
  },
  emptyTitle: {
    color: colors.primaryText,
    fontSize: scale(20),
    fontFamily: font.primaryFontFamily,
    fontWeight: "600",
    marginTop: verticalScale(10),
    textAlign: "center",
  },
  emptySubtitle: {
    color: "#666",
    fontSize: scale(14),
    fontFamily: font.primaryFontFamily,
    marginTop: verticalScale(10),
    textAlign: "center",
    lineHeight: scale(20),
  },
});
