import React, { useEffect, useMemo } from "react";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";
import { insertSet } from "../data/database";
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
    addSet({ reps: parseInt(reps), weight: parseInt(weight), notes, timestamp: new Date() });
    close();
  };

  return useMemo(() => (
    <>
      {/* @ts-ignore */}
      <Dialog.Title>Add new set</Dialog.Title>
      <Dialog.Content>
        <TextInput
          label="Reps"
          keyboardType="decimal-pad"
          value={reps}
          onChangeText={(reps) => setReps(reps)}
        />
        <TextInput
          label="Weight"
          keyboardType="decimal-pad"
          value={weight}
          onChangeText={(weight) => setWeight(weight)}
        />
        <TextInput
          multiline
          label="Notes"
          value={notes}
          onChangeText={(notes) => setNotes(notes)}
        />
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={close}>Cancel</Button>
        <Button onPress={submit}>Add</Button>
      </Dialog.Actions>
    </>
  ), [reps, weight, notes]);
}
