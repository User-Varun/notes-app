import { StyleSheet } from "react-native";
import colors from "../theme/index";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

export const globalStyles = StyleSheet.create({
  // Screen Containers
  screenContainer: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
    paddingVertical: verticalScale(20),
  },

  // Common Components
  card: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: scale(12),
    padding: scale(16),
    marginBottom: verticalScale(12),
  },

  // Text Styles
  title: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: verticalScale(8),
  },

  subtitle: {
    fontSize: moderateScale(18),
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: verticalScale(6),
  },

  bodyText: {
    fontSize: moderateScale(16),
    color: "#FFFFFF",
    lineHeight: moderateScale(22),
  },

  caption: {
    fontSize: moderateScale(14),
    color: "#CCCCCC",
  },
});

// Export individual style categories for better organization
export const containerStyles = {
  screen: globalStyles.screenContainer,
};
