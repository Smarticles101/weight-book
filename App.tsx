import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  DataTable,
  FAB,
  Portal,
  Provider as PaperProvider,
  Dialog,
  TextInput,
  Button,
  Appbar,
} from "react-native-paper";

export default function App() {
  const [data, setData] = React.useState([
    { time: Date.now().toString(), reps: 10, weight: 100 },
  ]);

  const [dialogVisible, setDialogVisible] = React.useState(false);
  const [time, setTime] = React.useState("");
  const [reps, setReps] = React.useState("");
  const [weight, setWeight] = React.useState("");

  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => {
    setDialogVisible(false);
    setTime("");
    setReps("");
    setWeight("");
  };

  return (
    <PaperProvider>
      <StatusBar style="auto" />
      <Appbar.Header>
        <Appbar.Content title="Workout Log" />
      </Appbar.Header>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Time</DataTable.Title>
          <DataTable.Title numeric>Reps</DataTable.Title>
          <DataTable.Title numeric>Weight</DataTable.Title>
        </DataTable.Header>

        {data.map((item, index) => (
          <DataTable.Row key={index}>
            <DataTable.Cell>{item.time}</DataTable.Cell>
            <DataTable.Cell numeric>{item.reps}</DataTable.Cell>
            <DataTable.Cell numeric>{item.weight}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>

      <FAB style={styles.fab} icon="plus" onPress={showDialog} />

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Title onPressIn onPressOut>
            Add new exercise
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
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button
              onPress={() => {
                setData([
                  ...data,
                  {
                    time: Date.now().toString(),
                    reps: parseInt(reps),
                    weight: parseInt(weight),
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
    </PaperProvider>
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
