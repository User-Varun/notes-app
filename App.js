import colors from "./src/theme/index";
import * as SystemUI from "expo-system-ui";
import Routes from "./src/navigation/Routes";
import { View } from "react-native";

import SQLiteDB_API from "./src/services/sqlite-db";
import { useEffect } from "react";
import { startForegroundSync } from "./src/services/sync";

import { debugDumpLocalDB } from "./src/services/sync";

/* The Original Code  */
export default function App() {
  useEffect(() => {
    async function handleInit() {
      // await debugDumpLocalDB();

      await SQLiteDB_API.initDB();
    }
    handleInit();

    // start periodic sync (adjust 5–10 mins)
    const stop = startForegroundSync(10 * 60 * 1000);
    return () => stop && stop();
  }, []);

  SystemUI.setBackgroundColorAsync(colors.primaryBackground);
  return (
    <View style={{ flex: 1 }}>
      <Routes />
    </View>
  );
}
