import colors from "./src/colors/colors";
import HomeScreenEmpty from "./src/screens/HomeScreenEmpty";

import * as SystemUI from "expo-system-ui";

export default function App() {
  SystemUI.setBackgroundColorAsync(colors.primaryBackground);
  return <HomeScreenEmpty />;
}
