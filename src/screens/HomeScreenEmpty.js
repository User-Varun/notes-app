import { View, Text, StyleSheet, Image, SafeAreaView } from "react-native";

import HeaderHome from "../components/HeaderHome";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import CreateNoteBtn from "../components/CreateNoteBtn";

import fonts from "../fonts/fonts";
import navigationStrings from "../constants/navigationStrings";
import { globalStyles } from "../styles/globalStyles";

import { useNotes } from "../hooks/useNotes";

export default function HomeScreenEmpty({ navigation }) {
  const { notes, loading, error } = useNotes();

  // show loading spinner
  if (loading) {
    <View style={[globalStyles.screenContainer, styles.centered]}>
      <ActivityIndicator size="large" color="#fff" />
      <Text style={styles.loadingText}>Loading notes...</Text>
    </View>;
  }

  // Show error message
  if (error) {
    return (
      <View style={[globalStyles.screenContainer, styles.centered]}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <CreateNoteBtn title="Retry" onPress={() => fetchNotes()} />
      </View>
    );
  }

  return (
    <View style={[globalStyles.screenContainer, styles.container]}>
      <HeaderHome />
      <View style={styles.imgContainer}>
        <Image
          source={require("../assets/empty-homeScreen.png")}
          style={styles.img}
        />
        <Text style={styles.imgText}>Create your first note !</Text>
      </View>
      <CreateNoteBtn
        onPress={() => navigation.navigate(navigationStrings.CREATE_EDIT)}
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
});
