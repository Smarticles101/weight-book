import React, { useEffect } from "react";
import { SectionList, StyleSheet } from "react-native";

import { DataTable, FAB, List } from "react-native-paper";
import { getSets } from "../data/database";
import { useExerciseSets } from "../data/exerciseSetsProvider";
import { IdExercise, IdExerciseSet } from "../data/types";

export default function ExerciseLog({ route, navigation }: any) {
  const [exerciseSetsByDay, setExerciseSetsByDay] = React.useState<
    { day: String; data: IdExerciseSet[] }[]
  >([]);

  const { exerciseSets } = useExerciseSets();

  useEffect(() => {
    let setsGroupedByDay = exerciseSets
      .sort((a, b) => b.timestamp.valueOf() - a.timestamp.valueOf())
      .reduce(
        (acc: { [key: string]: IdExerciseSet[] }, set) => ({
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

  const addSet = () => {
    let reps, weight, notes;

    if (exerciseSets.length > 0) {
      // autofill most recent set for adding
      const lastSet = exerciseSets[0];

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

  const editSet = (editSet: IdExerciseSet) => {
    navigation.navigate("Edit Set", {
      setId: editSet.id,
      startReps: editSet.reps.toString(),
      startWeight: editSet.weight.toString(),
      startNotes: editSet.notes,
      startTimestamp: editSet.timestamp.toISOString(),
    });
  };

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
                onPress={() => editSet(item)}
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

      <FAB style={styles.fab} icon="plus" onPress={addSet} />
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
