//import liraries
import { NavigationContainer } from "@react-navigation/native";

import HomeStack from "./HomeStack";

import * as SystemSettings from "expo-system-ui";
import colors from "../theme";
import { StatusBar } from "react-native";

// create a component
export default function Routes() {
  SystemSettings.setBackgroundColorAsync(colors.primaryBackground);

  return (
    <>
      <StatusBar barStyle="default" />
      <NavigationContainer>{HomeStack()}</NavigationContainer>
    </>
  );
}
