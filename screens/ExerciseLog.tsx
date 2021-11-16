import React, { useEffect } from "react";
import { Keyboard, ScrollView, SectionList, StyleSheet } from "react-native";

import {
  DataTable,
  FAB,
  Portal,
  Dialog,
  TextInput,
  Button,
  List,
  Menu,
} from "react-native-paper";
import { deleteSet, getSets, insertSet, updateSet } from "../data/database";
import { Exercise, Set } from "../data/types";
import AddSet from "./AddSet";
import EditSet from "./EditSet";

export default function ExerciseLog({ route, navigation }: any) {
  const [exerciseSets, setExerciseSets] = React.useState<Set[]>([]);
  const [exerciseSetsByDay, setExerciseSetsByDay] = React.useState<
    { day: String; data: Set[] }[]
  >([]);

  const exercise: Exercise = route.params.exercise;

  useEffect(() => {
    getSets(exercise.id, (sets) => {
      setExerciseSets(sets);
    });
  }, [exercise]);

  useEffect(() => {
    let setsGroupedByDay = exerciseSets
      .sort((a, b) => b.timestamp.valueOf() - a.timestamp.valueOf())
      .reduce(
        (acc: { [key: string]: Set[] }, set) => ({
          ...acc,
          [set.timestamp.toLocaleDateString()]: [
            ...(acc[set.timestamp.toLocaleDateString()] || []),
            set,
          ],
        }),
        {}
      );

    let days = Object.keys(setsGroupedByDay);
    days.sort();
    days.reverse();

    let rows = days.map((day) => {
      let sets = setsGroupedByDay[day];
      return {
        day,
        data: sets,
      };
    });

    setExerciseSetsByDay(rows);
  }, [exerciseSets]);

  const [addDialogVisible, setAddDialogVisible] = React.useState(false);
  const [reps, setReps] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const showAddDialog = () => {
    if (exerciseSets.length > 0) {
      // autofill most recent set for adding
      const lastSet = exerciseSets[0];

      setReps(lastSet.reps.toString());
      setWeight(lastSet.weight.toString());
      setNotes(lastSet.notes);
    }

    setAddDialogVisible(true);
  };

  const hideDialog = () => {
    setSelectedSet(undefined);
    setAddDialogVisible(false);
    setReps("");
    setWeight("");
    setNotes("");
  };

  const [selectedSet, setSelectedSet] = React.useState<Set>();

  return (
    <>
      <DataTable style={styles.dataTable}>
        <DataTable.Header>
          <DataTable.Title>Time</DataTable.Title>
          <DataTable.Title numeric>Reps</DataTable.Title>
          <DataTable.Title numeric>Weight</DataTable.Title>
        </DataTable.Header>
        <SectionList
          style={styles.list}
          sections={exerciseSetsByDay}
          keyExtractor={(item) => item.id.toString()}
          renderSectionHeader={({ section: { day } }) => (
            <List.Subheader onPressIn onPressOut>
              {day}
            </List.Subheader>
          )}
          renderItem={({ item }) => (
            <>
              <List.Item
                title={() => (
                  <DataTable.Cell>
                    {item.timestamp.toLocaleTimeString()}
                  </DataTable.Cell>
                )}
                descriptionEllipsizeMode="middle"
                descriptionNumberOfLines={1}
                description={item.notes}
                onPress={() => {
                  setSelectedSet(item);
                  setReps(item.reps.toString());
                  setWeight(item.weight.toString());
                  setNotes(item.notes);
                }}
                right={() => (
                  <>
                    <DataTable.Cell numeric>{item.reps}</DataTable.Cell>
                    <DataTable.Cell numeric>{item.weight}</DataTable.Cell>
                  </>
                )}
              ></List.Item>
            </>
          )}
        />
      </DataTable>

      <FAB style={styles.fab} icon="plus" onPress={showAddDialog} />

      <AddSet
        startReps={reps}
        startWeight={weight}
        startNotes={notes}
        onDismiss={hideDialog}
        visible={addDialogVisible}
        onSubmit={(reps: number, weight: number, notes: string) => {
          insertSet(exercise.id, reps, weight, new Date(), notes, (sets) => {
            setExerciseSets([...exerciseSets, sets]);
          });
          hideDialog();
        }}
      />

      <EditSet
        startReps={reps}
        startWeight={weight}
        startNotes={notes}
        onDismiss={hideDialog}
        visible={selectedSet !== undefined}
        onDelete={() => {
          if (selectedSet) {
            deleteSet(selectedSet.id, () => {
              setExerciseSets(
                exerciseSets.filter((set) => set.id !== selectedSet.id)
              );
              hideDialog();
            });
          }
        }}
        onSubmit={(reps: number, weight: number, notes: string) => {
          if (selectedSet) {
            updateSet(selectedSet.id, reps, weight, notes, () => {
              setExerciseSets(
                exerciseSets.map((set) =>
                  set.id === selectedSet.id
                    ? {
                        ...set,
                        reps,
                        weight,
                        notes,
                      }
                    : set
                )
              );
            });
          }
          hideDialog();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  dataTable: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
});
