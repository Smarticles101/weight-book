import React from "react";
import { FlatList, StyleSheet } from "react-native";

import {
  FAB,
  Portal,
  Dialog,
  TextInput,
  Button,
  List,
} from "react-native-paper";

export default function App({ navigation }: any) {
  const [data, setData] = React.useState([
    { exercise: "Bench Press" },
    { exercise: "Squat" },
    { exercise: "Deadlift" },
  ]);

  const [dialogVisible, setDialogVisible] = React.useState(false);

  const [exercise, setExercise] = React.useState("");

  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => {
    setDialogVisible(false);
    setExercise("");
  };

  return (
    <>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <List.Item
            title={item.exercise}
            onPress={() => {
              // navigate to exercise log
              navigation.push("Exercise Log", { exercise: item.exercise });
            }}
          />
        )}
        keyExtractor={(item) => item.exercise}
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
                setData([
                  ...data,
                  {
                    exercise: exercise,
                  },
                ]);
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
