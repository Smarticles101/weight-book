import React, { useEffect, useMemo } from "react";
import { FlatList, StyleSheet } from "react-native";

import {
  FAB,
  Portal,
  Dialog,
  TextInput,
  Button,
  List,
} from "react-native-paper";
import { useExerciseSets } from "../data/exerciseSetsProvider";
import { useExercises } from "../data/exercisesProvider";

export default function Exercises({ navigation }: any) {
  const [dialogVisible, setDialogVisible] = React.useState(false);
  const [exercise, setExercise] = React.useState("");

  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => {
    setDialogVisible(false);
    setExercise("");
  };

  const { useExercise } = useExerciseSets();
  const { loadExercises, addExercise, exercises } = useExercises();

  useEffect(() => {
    loadExercises();
  }, []);

  return useMemo(
    () => (
      <>
        <FlatList
          data={exercises}
          renderItem={({ item }) => (
            <List.Item
              title={item.name}
              onPress={() => {
                useExercise(item.id);
                navigation.push("Exercise Log");
              }}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />

        <FAB style={styles.fab} icon="plus" onPress={showDialog} />

        <Portal>
          <Dialog visible={dialogVisible} onDismiss={hideDialog}>
            <Dialog.Title onPressIn onPressOut>
              Add new exercise
            </Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Exercise"
                value={exercise}
                onChangeText={(exercise) => setExercise(exercise)}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Cancel</Button>
              <Button
                onPress={() => {
                  addExercise({ name: exercise, description: "" });
                  hideDialog();
                }}
              >
                Add
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </>
    ),
    [exercises, dialogVisible, exercise]
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
});
