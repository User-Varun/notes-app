import { View, Text, StyleSheet } from "react-native";

export default function ReusableNavHeader() {
  return (
    <View style={styles.container}>
      <Text>ReusableNavHeader</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
