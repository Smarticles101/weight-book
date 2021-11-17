import React, { useEffect } from "react";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";
import { deleteSet, insertSet, updateSet } from "../data/database";
import { Set } from "../data/types";

export default function EditSet({ navigation, route }: any) {
  const [reps, setReps] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const { setId, startReps, startWeight, startNotes, onSubmit, onDelete } =
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
    updateSet(setId, parseInt(reps), parseInt(weight), notes, (set: Set) => {
      if (onSubmit) {
        onSubmit(set);
      }
      close();
    });
  };

  const del = () => {
    deleteSet(setId, () => {
      if (onDelete) {
        onDelete();
      }
      close();
    });
    setReps("");
    setWeight("");
    setNotes("");
  };

  return (
    <>
      {/* @ts-ignore */}
      <Dialog.Title>
        Edit set
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
        <Button color="red" onPress={del}>
          Delete
        </Button>
        <Button onPress={close}>Cancel</Button>

        <Button
          onPress={() => {
            submit();
          }}
        >
          Update
        </Button>
      </Dialog.Actions>
    </>
  );
}
