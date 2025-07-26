import { View, Text, StyleSheet } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import ReusableNavHeader from "../components/ReusableNavHeader";
import { scale } from "react-native-size-matters";

export default function EditNoteScreen() {
  return (
    <View style={[globalStyles.screenContainer, styles.container]}>
      <ReusableNavHeader saveBtn={true} editBtn={false} />
      <View style={styles.notesContainer}>
        <Text style={{ color: "#fff" }}>
          Exisiting Note Edit will come here
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: scale(20),
  },
  notesContainer: {
    paddingHorizontal: scale(20),
    flexGrow: 1,
  },
});
