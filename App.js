import colors from "./src/theme/index";
import * as SystemUI from "expo-system-ui";
import Routes from "./src/navigation/Routes";
import { View } from "react-native";

export default function App() {
  SystemUI.setBackgroundColorAsync(colors.primaryBackground);
  return (
    <View style={{ flex: 1 }}>
      <Routes />
    </View>
  );
}
