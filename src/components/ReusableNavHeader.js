import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  StatusBar,
} from "react-native";

import colors from "../theme/index";
import images from "../images/images";
import { scale } from "react-native-size-matters";

export default function ReusableNavHeader({
  saveBtn = true,
  editBtn = false,
  onPressSave,
  onPressBack,
  onPressEdit,
}) {
  return (
    <View style={{ ...styles.headerContainer }}>
      <Pressable style={styles.pressable} onPress={onPressBack}>
        <Image
          source={images.backBtn}
          style={{ ...styles.img, width: scale(32), height: scale(32) }}
        />
      </Pressable>

      <Pressable
        style={styles.pressable}
        onPress={onPressSave ? onPressSave : onPressEdit}
      >
        <Image
          source={saveBtn ? images.saveBtn : images.editBtn}
          style={styles.img}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.primaryBackground,
    paddingHorizontal: scale(20),
    paddingTop: scale(20),
  },

  img: {
    color: "#fff",
    width: scale(24),
    height: scale(24),
  },
  pressable: {
    width: scale(48),
    height: scale(48),
    backgroundColor: colors.secondaryBackground,
    borderRadius: scale(15),
    alignItems: "center",
    justifyContent: "center",
  },
});
