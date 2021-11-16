import React, { useEffect } from "react";
import { FlatList, SectionList, StyleSheet } from "react-native";

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

export default function App({ route, navigation }: any) {
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

  const [dialogVisible, setDialogVisible] = React.useState(false);
  const [reps, setReps] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const showDialog = () => {
    if (selectedEditingSet) {
      // autofill selected set for editing
      setReps(selectedEditingSet.reps.toString());
      setWeight(selectedEditingSet.weight.toString());
      setNotes(selectedEditingSet.notes);
    } else if (exerciseSets.length > 0) {
      // autofill last set for adding
      const lastSet = exerciseSets[exerciseSets.length - 1];

      setReps(lastSet.reps.toString());
      setWeight(lastSet.weight.toString());
      setNotes(lastSet.notes);
    }

    setDialogVisible(true);
  };

  const hideDialog = () => {
    // clear dialog fields and hide
    setDialogVisible(false);
    setReps("");
    setWeight("");
    setNotes("");
    setSelectedEditingSet(undefined);
  };

  const [menuVisible, setMenuVisible] = React.useState(false);
  const [menuCoordinates, setMenuCoordinates] = React.useState({
    x: 0,
    y: 0,
  });

  const showMenu = () => setMenuVisible(true);
  const hideMenu = () => setMenuVisible(false);

  const [selectedEditingSet, setSelectedEditingSet] = React.useState<Set>();

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
                  // TODO: show drawer with set info, or just another screen
                }}
                onLongPress={(event) => {
                  const x = event.nativeEvent.pageX;
                  const y = event.nativeEvent.pageY;
                  setMenuCoordinates({ x, y });
                  setSelectedEditingSet(item);
                  showMenu();
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
            {!selectedEditingSet ? (
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
            ) : (
              <Button
                onPress={() => {
                  updateSet(
                    selectedEditingSet.id,
                    parseInt(reps),
                    parseInt(weight),
                    notes,
                    () => {
                      setExerciseSets(
                        exerciseSets.map((set) =>
                          set.id === selectedEditingSet.id
                            ? {
                                ...set,
                                reps: parseInt(reps),
                                weight: parseInt(weight),
                                notes,
                              }
                            : set
                        )
                      );
                    }
                  );
                  hideDialog();
                }}
              >
                Update
              </Button>
            )}
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Menu visible={menuVisible} onDismiss={hideMenu} anchor={menuCoordinates}>
        <Menu.Item
          onPress={() => {
            if (selectedEditingSet) {
              hideMenu();
              showDialog();
            }
          }}
          title="Edit"
          icon="pencil"
        />
        <Menu.Item
          onPress={() => {
            if (selectedEditingSet) {
              deleteSet(selectedEditingSet.id, () => {
                setExerciseSets(
                  exerciseSets.filter((set) => set.id !== selectedEditingSet.id)
                );
                setSelectedEditingSet(undefined);
                hideMenu();
              });
            }
          }}
          title="Delete"
          icon="delete"
        />
      </Menu>
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
