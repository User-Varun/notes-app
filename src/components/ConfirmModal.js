import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function ConfirmModal({
  visible,
  title = "",
  message,
  onDelete,
  onEdit,
  onCancel,
  deleteText = "Delete",
  editText = "Edit",
  cancelText = "Cancel",
  deleteColor = "#E53935", // red
  editColor = "#2ECC71", // green
  showCancel = true,
}) {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onCancel} />
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <FontAwesome name="info" size={20} color="#bbb" />
          </View>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: deleteColor }]}
              onPress={onDelete}
            >
              <Text style={styles.btnText}>{deleteText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: editColor }]}
              onPress={onEdit}
            >
              <Text style={styles.btnText}>{editText}</Text>
            </TouchableOpacity>
            {showCancel ? (
              <TouchableOpacity
                style={[styles.btn, styles.ghostBtn]}
                onPress={onCancel}
              >
                <Text style={styles.ghostBtnText}>{cancelText}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: scale(24),
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  card: {
    width: "100%",
    backgroundColor: "#2A2A2A",
    borderRadius: scale(16),
    padding: scale(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  iconWrap: {
    alignSelf: "center",
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: "#3B3B3B",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(12),
  },
  title: {
    color: "#ECEDEE",
    fontSize: scale(18),
    textAlign: "center",
    marginBottom: verticalScale(8),
    fontWeight: "600",
  },
  message: {
    color: "#ECEDEE",
    fontSize: scale(16),
    textAlign: "center",
    marginBottom: verticalScale(16),
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: scale(10),
  },
  btn: {
    flex: 1,
    paddingVertical: verticalScale(10),
    borderRadius: scale(10),
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "500",
  },
  ghostBtn: {
    backgroundColor: "#3B3B3B",
  },
  ghostBtnText: {
    color: "#ECEDEE",
    fontWeight: "500",
  },
});
