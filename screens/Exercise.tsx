import React, { useLayoutEffect, useMemo } from "react";
import { StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ExerciseLog from "./ExerciseLog";
import ExerciseGraph from "./ExerciseGraph";
import { Appbar, FAB } from "react-native-paper";
import { useExercises } from "../data/exercisesProvider";

const Tab = createMaterialTopTabNavigator();

export default function Exercise({ route, navigation }: any) {
  const { activeExercise, exerciseSets } = useExercises();

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

  const addSet = () => {
    let reps, weight, notes;

    if (exerciseSets.length > 0) {
      // autofill most recent set for adding
      const lastSet = exerciseSets[exerciseSets.length - 1];

      reps = lastSet.reps.toString();
      weight = lastSet.weight.toString();
      notes = lastSet.notes;
    }

    navigation.navigate("Add Set", {
      startReps: reps,
      startWeight: weight,
      startNotes: notes,
    });
  };

  return (
    <>
      <Tab.Navigator>
        <Tab.Screen name="Log" component={ExerciseLog} />
        <Tab.Screen name="Analytics" component={ExerciseGraph} />
      </Tab.Navigator>

      <FAB style={styles.fab} icon="plus" onPress={addSet} />
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
