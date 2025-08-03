//import liraries
import { NavigationContainer } from "@react-navigation/native";

import HomeStack from "./HomeStack";

import * as SystemSettings from "expo-system-ui";
import colors from "../theme";
import { StatusBar } from "expo-status-bar";

// create a component
export default function Routes() {
  SystemSettings.setBackgroundColorAsync(colors.primaryBackground);

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <HomeStack />
    </NavigationContainer>
  );
}
