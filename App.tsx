import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import analytics from "@react-native-firebase/analytics";

import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";

import ExerciseSetsProvider from "./data/exerciseSetsProvider";
import ExercisesProvider from "./data/exercisesProvider";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import ExercisesScreen from "./screens/Exercises";
import ExerciseLog from "./screens/ExerciseLog";
import AddSet from "./screens/AddSet";
import EditSet from "./screens/EditSet";
import AddExercise from "./screens/AddExercise";
import EditExercise from "./screens/EditExercise";

import { en, registerTranslation } from "react-native-paper-dates";
import Exercise from "./screens/Exercise";

registerTranslation("en", en);

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    card: DefaultTheme.colors.surface,
    border: DefaultTheme.colors.accent,
  },
};

// TODO:
//  - review ts-ignores

function App() {
  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();

  return (
    <ExerciseSetsProvider>
      <ExercisesProvider>
        <PaperProvider theme={theme}>
          <StatusBar style="auto" />
          <NavigationContainer
            theme={theme}
            /* @ts-ignore */
            ref={navigationRef}
            onReady={() => {
              routeNameRef.current =
                /* @ts-ignore */
                navigationRef.current.getCurrentRoute().name;
              analytics().logScreenView({
                screen_name: routeNameRef.current,
                screen_class: routeNameRef.current,
              });
            }}
            onStateChange={async () => {
              const previousRouteName = routeNameRef.current;
              const currentRouteName =
                /* @ts-ignore */
                navigationRef.current.getCurrentRoute().name;

              if (previousRouteName !== currentRouteName) {
                await analytics().logScreenView({
                  screen_name: currentRouteName,
                  screen_class: currentRouteName,
                });
              }
              routeNameRef.current = currentRouteName;
            }}
          >
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
                <Stack.Screen name="Exercise Log" component={Exercise} />
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
