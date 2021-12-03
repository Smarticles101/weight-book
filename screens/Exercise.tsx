import React, { useLayoutEffect, useMemo } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ExerciseLog from "./ExerciseLog";
import ExerciseGraph from "./ExerciseGraph";
import { useExerciseSets } from "../data/exerciseSetsProvider";
import { Appbar } from "react-native-paper";

const Tab = createMaterialTopTabNavigator();

export default function Exercise({ route, navigation }: any) {
  const { activeExercise } = useExerciseSets();

  const { defaultName, defaultId } = route.params;

  useLayoutEffect(() => {
    let id = activeExercise.id;
    let name = activeExercise.name;

    if (defaultId != id) {
      id = defaultId;
      name = defaultName;
    }

    navigation.setOptions({
      headerRight: () => (
        <Appbar.Action
          icon="pencil"
          onPress={() => {
            navigation.push("Edit Exercise", {
              exerciseId: id,
              startExerciseName: name,
            });
          }}
        />
      ),
      title: activeExercise.name,
    });
  }, [
    navigation,
    activeExercise.id,
    activeExercise.name,
    defaultId,
    defaultName,
  ]);

  return (
    <Tab.Navigator>
      <Tab.Screen name="Log" component={ExerciseLog} />
      <Tab.Screen name="Analytics" component={ExerciseGraph} />
    </Tab.Navigator>
  );
}
