// In App.js in a new project

import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Provider as PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";

import ExerciseSetsProvider from "./data/exerciseSetsProvider";
import ExercisesProvider from "./data/exercisesProvider";

import Header from "./components/Header";
import Footer from "./components/Footer";

import ExercisesScreen from "./screens/Exercises";
import ExerciseLog from "./screens/ExerciseLog";
import AddSet from "./screens/AddSet";
import EditSet from "./screens/EditSet";
import AddExercise from "./screens/AddExercise";
import EditExercise from "./screens/EditExercise";

import { en, registerTranslation } from "react-native-paper-dates";

registerTranslation("en", en);

const Stack = createNativeStackNavigator();

// TODO:
//  - review this https://reactnavigation.org/docs/typescript/
function App() {
  return (
    <ExerciseSetsProvider>
      <ExercisesProvider>
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
              <Stack.Group screenOptions={{ presentation: "containedModal" }}>
                <Stack.Screen name="Add Set" component={AddSet} />
                <Stack.Screen name="Edit Set" component={EditSet} />
                <Stack.Screen name="Add Exercise" component={AddExercise} />
                <Stack.Screen name="Edit Exercise" component={EditExercise} />
              </Stack.Group>
            </Stack.Navigator>
          </NavigationContainer>
          <Footer />
        </PaperProvider>
      </ExercisesProvider>
    </ExerciseSetsProvider>
  );
}

export default App;
