import React, { useEffect } from "react";
import { FlatList, StyleSheet } from "react-native";

import { getExercises, insertExercise } from "../data/database";

import type { Exercise } from "../data/types";

import {
  FAB,
  Portal,
  Dialog,
  TextInput,
  Button,
  List,
} from "react-native-paper";

export default function Exercises({ navigation }: any) {
  const [exercises, setExercises] = React.useState<Exercise[]>([]);

  const [dialogVisible, setDialogVisible] = React.useState(false);
  const [exercise, setExercise] = React.useState("");

  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => {
    setDialogVisible(false);
    setExercise("");
  };

  useEffect(() => {
    getExercises((exercises) => {
      setExercises(exercises);
    });
  }, []);

  return (
    <>
      <FlatList
        data={exercises}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            onPress={() => {
              // navigate to exercise log
              navigation.push("Exercise Log", { exercise: item });
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
                insertExercise(exercise, "", (exercise) => {
                  setExercises([...exercises, exercise]);
                });
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
});
