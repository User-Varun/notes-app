import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  HomeScreenEmpty,
  CreateEditNoteScreen,
  DetailedNoteView,
} from "../screens/index";
import navigationStrings from "../constants/navigationStrings";
import EditNoteScreen from "../screens/EditNoteScreen";
import SearchNotes from "../screens/SearchNotes";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={navigationStrings.EMPTYHOME}
        component={HomeScreenEmpty}
      />
      <Stack.Screen
        name={navigationStrings.CREATE_EDIT}
        component={CreateEditNoteScreen}
      />
      <Stack.Screen
        name={navigationStrings.DETAILED_NOTE}
        component={DetailedNoteView}
      />

      <Stack.Screen
        name={navigationStrings.EDIT_NOTE}
        component={EditNoteScreen}
      />

      <Stack.Screen
        name={navigationStrings.SEARCH_NOTE}
        component={SearchNotes}
      />
    </Stack.Navigator>
  );
}
