import React, { useEffect, useMemo } from "react";
import { Button, Dialog, TextInput } from "react-native-paper";
import { deleteSet, updateSet } from "../data/database";
import { useExerciseSets } from "../data/exerciseSetsProvider";
import { IdExerciseSet } from "../data/types";

export default function EditSet({ navigation, route }: any) {
  const [reps, setReps] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const { setId, startReps, startWeight, startNotes, timestamp } =
    route.params;

  const startTimestamp = new Date(timestamp);

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
    editSet({ id: setId, reps: parseInt(reps), weight: parseInt(weight), notes, timestamp: startTimestamp });
    close();
  };

  const del = () => {
    removeSet(setId);
    close();
    setReps("");
    setWeight("");
    setNotes("");
  };

  return useMemo(() => (
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
  ), [reps, weight, notes]);
}
