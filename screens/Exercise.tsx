import React, { useEffect, useLayoutEffect } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ExerciseLog from "./ExerciseLog";
import ExerciseGraph from "./ExerciseGraph";
import { useExerciseSets } from "../data/exerciseSetsProvider";
import { Appbar } from "react-native-paper";

const Tab = createMaterialTopTabNavigator();

export default function Exercise({ route, navigation }: any) {
  const { useExercise, activeExerciseId, activeExerciseName } =
    useExerciseSets();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Appbar.Action
          icon="pencil"
          onPress={() => {
            navigation.push("Edit Exercise", {
              exerciseId: activeExerciseId,
              startExerciseName: activeExerciseName,
            })
          }
          }
        />
      ),
      title: activeExerciseName,
    });
  }, [navigation, activeExerciseId, activeExerciseName]);

  return (
    <Tab.Navigator>
      <Tab.Screen name="Log" component={ExerciseLog} />
      <Tab.Screen name="Analytics" component={ExerciseGraph} />
    </Tab.Navigator>
  );
}
