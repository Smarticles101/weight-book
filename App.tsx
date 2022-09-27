import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import analytics from "@react-native-firebase/analytics";
import functions from "@react-native-firebase/functions";

import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";

import ExercisesProvider from "./data/exercisesProvider";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import ExercisesScreen from "./screens/Exercises";
import AddSet from "./screens/AddSet";
import EditSet from "./screens/EditSet";
import AddExercise from "./screens/AddExercise";
import EditExercise from "./screens/EditExercise";
import HistoryScreen from "./screens/History";

import { en, registerTranslation } from "react-native-paper-dates";
import Exercise from "./screens/Exercise";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import { generateDevData } from "./data/database";
import mobileAds from "react-native-google-mobile-ads";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import InAppReview from "react-native-in-app-review";

registerTranslation("en", en);

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

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

if (__DEV__) {
  analytics().setAnalyticsCollectionEnabled(false);
  //functions().useEmulator('localhost', 5001);
  generateDevData();
}

function App() {
  React.useEffect(() => {
    (async () => {
      const { status } = await requestTrackingPermissionsAsync();
      if (status === "granted") {
        console.log("Yay! I have user permission to track data");
      }
    })();

    mobileAds()
      .initialize()
      .then((adapterStatuses) => {
        // Initialization complete!
      });
  }, []);

  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();

  return (
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
          <Tab.Navigator>
            <Tab.Screen
              name="ExercisesStack"
              component={ExercisesStack}
              options={{
                tabBarLabel: "Exercises",
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons
                    name="weight-lifter"
                    color={color}
                    size={26}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="History"
              component={HistoryScreen}
              options={{
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons
                    name="history"
                    color={color}
                    size={26}
                  />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
        <Footer />
      </PaperProvider>
    </ExercisesProvider>
  );
}

const ExercisesStack = () => (
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
);

export default App;
