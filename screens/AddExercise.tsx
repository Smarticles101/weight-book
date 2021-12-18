import React, { useLayoutEffect, useMemo } from "react";
import {
  Keyboard,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { TextInput, Dialog, Appbar, HelperText } from "react-native-paper";
import { useExercises } from "../data/exercisesProvider";

export default function AddSet({ navigation, route }: any) {
  const [exerciseName, setExerciseName] = React.useState("");

  const [exerciseNameErr, setExerciseNameErr] = React.useState(false);

  const { addExercise } = useExercises();

  const close = () => {
    navigation.goBack();
  };

  const submit = () => {
    if (exerciseName.length > 0) {
      addExercise({ name: exerciseName, description: "" });
      close();
    } else {
      setExerciseNameErr(true);
    }
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
              <Dialog.Title>Add new exercise</Dialog.Title>
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
                  error={exerciseNameErr}
                />
              </Dialog.Content>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    ),
    [exerciseName]
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
