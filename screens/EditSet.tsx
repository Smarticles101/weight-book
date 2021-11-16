import React, { useEffect } from "react";
import { ScrollView } from "react-native";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";

export default function EditSet({
  onDismiss,
  onSubmit,
  onDelete,
  visible,
  startReps,
  startWeight,
  startNotes,
}: any) {
  const [reps, setReps] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [notes, setNotes] = React.useState("");

  useEffect(() => {
    setReps(startReps);
    setWeight(startWeight);
    setNotes(startNotes);
  }, [visible]);

  const close = () => {
    onDismiss();
    setReps("");
    setWeight("");
    setNotes("");
  };
  const submit = () => {
    onSubmit(reps, weight, notes);
    setReps("");
    setWeight("");
    setNotes("");
  };
  const del = () => {
    onDelete();
    setReps("");
    setWeight("");
    setNotes("");
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={close}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Dialog.Title onPressIn onPressOut>
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
        </ScrollView>
      </Dialog>
    </Portal>
  );
}
