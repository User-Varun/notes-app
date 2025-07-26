import { View, Text, StyleSheet } from "react-native";
import ReusableNavHeader from "../components/ReusableNavHeader";
import { globalStyles } from "../styles/globalStyles";
import { scale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import colors from "../theme";

export default function DetailedNoteView() {
  const navigation = useNavigation();

  return (
    <View style={[globalStyles.screenContainer, styles.container]}>
      <ReusableNavHeader
        saveBtn={false}
        editBtn={true}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.notesContainer}>
        <Text style={{ color: "#fff" }}>
          there will the text and description will go
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
  },
});
