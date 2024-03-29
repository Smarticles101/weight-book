import React, { useEffect, useLayoutEffect, useMemo } from "react";
import {
  Keyboard,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import {
  Appbar,
  Button,
  Dialog,
  HelperText,
  Paragraph,
  Portal,
  TextInput,
} from "react-native-paper";
import { useExercises } from "../data/exercisesProvider";

export default function EditExercise({ navigation, route }: any) {
  const [exerciseName, setExerciseName] = React.useState("");

  const [exerciseNameErr, setExerciseNameErr] = React.useState(false);

  const [deleteDialogVisible, setDeleteDialogVisible] = React.useState(false);

  const { exerciseId, startExerciseName } = route.params;

  const { editExercise, removeExercise, activeExercise, useExercise } =
    useExercises();

  useEffect(() => {
    setExerciseName(startExerciseName);
  }, []);

  const submit = () => {
    if (exerciseName.length > 0) {
      editExercise({ id: exerciseId, name: exerciseName, description: "" });
      if (activeExercise.id === exerciseId) {
        useExercise({ id: exerciseId, name: exerciseName, description: "" });
      }
      setExerciseName("");
      navigation.goBack();
    } else {
      setExerciseNameErr(true);
    }
  };

  const showDeleteConfirm = () => {
    setDeleteDialogVisible(true);
  };

  const closeDeleteConfirm = () => {
    setDeleteDialogVisible(false);
    deleteSet();
  };

  const deleteSet = () => {
    removeExercise(exerciseId);
    setExerciseName("");
    navigation.navigate("Exercises");
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => [
        <Appbar.Action
          icon="delete"
          onPress={showDeleteConfirm}
          key="del-action"
        />,
        <Appbar.Action
          icon="content-save"
          onPress={submit}
          key="submit-action"
        />,
      ],
    });
  }, [navigation, submit, deleteSet]);

  return useMemo(
    () => (
      <>
        <Portal>
          <Dialog visible={deleteDialogVisible} onDismiss={closeDeleteConfirm}>
            {/* @ts-ignore */}
            <Dialog.Title>Delete exercise?</Dialog.Title>
            <Dialog.Content>
              <Paragraph>
                Are you sure you want to delete this exercise? This will also
                delete all associated sets.
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={closeDeleteConfirm}>Cancel</Button>
              <Button onPress={deleteSet}>Delete</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
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
                <Dialog.Title>Edit exercise</Dialog.Title>
                <Dialog.Content style={styles.container}>
                  {/* @ts-ignore */}
                  <HelperText type="error" visible={exerciseNameErr}>
                    Exercise name is required
                  </HelperText>
                  <TextInput
                    label="Exercise name"
                    value={exerciseName}
                    onChangeText={(exercise) => {
                      setExerciseNameErr(exercise.length === 0);
                      setExerciseName(exercise);
                    }}
                    style={styles.textBox}
                  />
                </Dialog.Content>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      </>
    ),
    [exerciseName, deleteDialogVisible]
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textBox: {
    marginBottom: 10,
  },
});
