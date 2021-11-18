// In App.js in a new project

import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from "@react-navigation/native-stack";

import { Provider as PaperProvider, Appbar } from "react-native-paper";
import { StatusBar } from "expo-status-bar";

import ExercisesScreen from "./screens/Exercises";
import ExerciseLog from "./screens/ExerciseLog";
import AddSet from "./screens/AddSet";
import EditSet from "./screens/EditSet";
import ExerciseSetsProvider from "./data/exerciseSetsProvider";

const Stack = createNativeStackNavigator();

const Header = ({
  navigation,
  route,
  options,
  back,
}: NativeStackHeaderProps) => {
  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : route.name;

  return (
    <Appbar.Header>
      {back && <Appbar.BackAction onPress={navigation.goBack} />}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
};

// TODO:
//  - review this https://reactnavigation.org/docs/typescript/
function App() {
  return (
    <ExerciseSetsProvider>
      <PaperProvider>
        <StatusBar style="auto" />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Exercises"
            screenOptions={{
              header: ({ navigation, route, options, back }) => (
                <Header
                  navigation={navigation}
                  route={route}
                  options={options}
                  back={back}
                />
              ),
            }}
          >
            <Stack.Group>
              <Stack.Screen name="Exercises" component={ExercisesScreen} />
              <Stack.Screen name="Exercise Log" component={ExerciseLog} />
            </Stack.Group>
            <Stack.Group screenOptions={{ presentation: "modal" }}>
              <Stack.Screen name="Add Set" component={AddSet} />
              <Stack.Screen name="Edit Set" component={EditSet} />
            </Stack.Group>
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </ExerciseSetsProvider>
  );
}

export default App;
