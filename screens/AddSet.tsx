import React, { useEffect, useLayoutEffect, useMemo } from "react";
import {
  Keyboard,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { TextInput, Dialog, Appbar } from "react-native-paper";
import { useExerciseSets } from "../data/exerciseSetsProvider";

export default function AddSet({ navigation, route }: any) {
  const [reps, setReps] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const { startReps, startWeight, startNotes } = route.params;
  const { addSet } = useExerciseSets();

  useEffect(() => {
    setReps(startReps);
    setWeight(startWeight);
    setNotes(startNotes);
  }, []);

  const close = () => {
    //onDismiss();
    setReps("");
    setWeight("");
    setNotes("");
    navigation.goBack();
  };

  const submit = () => {
    addSet({
      reps: parseInt(reps) || 0,
      weight: parseInt(weight) || 0,
      notes,
      timestamp: new Date(),
    });
    close();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Appbar.Action icon="content-save" onPress={submit} />,
    });
  }, [navigation, submit]);

  return useMemo(
    () => (
      <KeyboardAvoidingView
        style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
        behavior="padding"
        enabled
        keyboardVerticalOffset={100}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <View style={styles.container}>
              {/* @ts-ignore */}
              <Dialog.Title>Add new set</Dialog.Title>
              <Dialog.Content style={styles.container}>
                <TextInput
                  label="Reps"
                  keyboardType="decimal-pad"
                  value={reps}
                  onChangeText={(reps) => setReps(reps)}
                  style={styles.textBox}
                />
                <TextInput
                  label="Weight"
                  keyboardType="decimal-pad"
                  value={weight}
                  onChangeText={(weight) => setWeight(weight)}
                  style={styles.textBox}
                />
                <TextInput
                  multiline
                  label="Notes"
                  value={notes}
                  onChangeText={(notes) => setNotes(notes)}
                  style={styles.multilineTextBox}
                />
              </Dialog.Content>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    ),
    [reps, weight, notes]
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textBox: {
    marginBottom: 10,
  },
  multilineTextBox: {
    flexGrow: 1,
  },
});