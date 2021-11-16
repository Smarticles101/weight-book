import React, { useEffect } from "react";
import { FlatList, StyleSheet } from "react-native";

import {
  DataTable,
  FAB,
  Portal,
  Dialog,
  TextInput,
  Button,
  Paragraph,
  List,
  Caption,
} from "react-native-paper";
import { getSets, insertSet } from "../data/database";
import { Exercise, Set } from "../data/types";

export default function App({ route, navigation }: any) {
  const [exerciseSets, setExerciseSets] = React.useState<Set[]>([]);

  const exercise: Exercise = route.params.exercise;

  useEffect(() => {
    getSets(exercise.id, (sets) => {
      setExerciseSets(sets);
    });
  }, [exercise]);

  const [dialogVisible, setDialogVisible] = React.useState(false);
  const [reps, setReps] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const showDialog = () => {
    // autofill dialog reps, weight, and notes to the last set
    if (exerciseSets.length > 0) {
      const lastSet = exerciseSets[exerciseSets.length - 1];
      setReps(lastSet.reps.toString());
      setWeight(lastSet.weight.toString());
      setNotes(lastSet.notes);
    }
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
    setReps("");
    setWeight("");
    setNotes("");
  };

  return (
    <>
      <DataTable style={styles.dataTable}>
        <DataTable.Header>
          <DataTable.Title>Time</DataTable.Title>
          <DataTable.Title numeric>Reps</DataTable.Title>
          <DataTable.Title numeric>Weight</DataTable.Title>
        </DataTable.Header>
        <FlatList
          style={styles.list}
          data={exerciseSets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <>
              <List.Item
                title={() => <DataTable.Cell>{item.timestamp.toString()}</DataTable.Cell>}
                descriptionEllipsizeMode="middle"
                descriptionNumberOfLines={1}
                description={item.notes}
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

      <FAB style={styles.fab} icon="plus" onPress={showDialog} />

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Title onPressIn onPressOut>
            Add new set
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Reps"
              value={reps}
              onChangeText={(sets) => setReps(sets)}
            />
            <TextInput
              label="Weight"
              value={weight}
              onChangeText={(reps) => setWeight(reps)}
            />
            <TextInput
              multiline
              label="Notes"
              value={notes}
              onChangeText={(notes) => setNotes(notes)}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button
              onPress={() => {
                insertSet(
                  exercise.id,
                  parseInt(reps),
                  parseInt(weight),
                  new Date(),
                  notes,
                  (sets) => {
                    setExerciseSets([...exerciseSets, sets]);
                  }
                );
                hideDialog();
              }}
            >
              Add
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
