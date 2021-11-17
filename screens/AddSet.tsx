import React, { useEffect } from "react";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";
import { insertSet } from "../data/database";

export default function AddSet({ navigation, route }: any) {
  const [reps, setReps] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const { exerciseId, startReps, startWeight, startNotes, onSubmit } =
    route.params;

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
    insertSet(
      exerciseId,
      parseInt(reps),
      parseInt(weight),
      new Date(),
      notes,
      (set) => {
        if (onSubmit) {
          onSubmit(set);
        }
        close();
      }
    );
  };

  return (
    <>
      {/* @ts-ignore */}
      <Dialog.Title>
        Add new set
      </Dialog.Title>
      <Dialog.Content>
        <TextInput
          label="Reps"
          keyboardType="decimal-pad"
          value={reps}
          onChangeText={(sets) => setReps(sets)}
        />
        <TextInput
          label="Weight"
          keyboardType="decimal-pad"
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
        <Button onPress={close}>Cancel</Button>
        <Button onPress={submit}>Add</Button>
      </Dialog.Actions>
    </>
  );
}
