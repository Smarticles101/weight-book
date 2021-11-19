import React, { useEffect, useLayoutEffect, useMemo } from "react";
import {
  Keyboard,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Appbar, Dialog, TextInput } from "react-native-paper";
import { useExerciseSets } from "../data/exerciseSetsProvider";

export default function EditSet({ navigation, route }: any) {
  const [reps, setReps] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const { setId, startReps, startWeight, startNotes, startTimestamp } =
    route.params;

  const timestamp = new Date(startTimestamp);

  const { editSet, removeSet } = useExerciseSets();

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
    editSet({
      id: setId,
      reps: parseInt(reps),
      weight: parseInt(weight),
      notes,
      timestamp,
    });
    close();
  };

  const del = () => {
    removeSet(setId);
    close();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => [
        <Appbar.Action icon="delete" onPress={del} key="del-action" />,
        <Appbar.Action
          icon="content-save"
          onPress={submit}
          key="submit-action"
        />,
      ],
    });
  }, [navigation, submit, del]);

  return useMemo(
    () => (
      <KeyboardAvoidingView
        style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
        behavior="padding"
        enabled
        keyboardVerticalOffset={100}
      >
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <View style={styles.container}>
              {/* @ts-ignore */}
              <Dialog.Title>Edit set</Dialog.Title>
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
