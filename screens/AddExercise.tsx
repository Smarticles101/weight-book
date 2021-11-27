import React, { useLayoutEffect, useMemo } from "react";
import {
  Keyboard,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { TextInput, Dialog, Appbar } from "react-native-paper";
import { useExercises } from "../data/exercisesProvider";

export default function AddSet({ navigation, route }: any) {
  const [exerciseName, setExerciseName] = React.useState("");

  const { addExercise } = useExercises();

  const close = () => {
    navigation.goBack();
  };

  const submit = () => {
    addExercise({ name: exerciseName, description: "" });
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
              <Dialog.Title>Add new exercise</Dialog.Title>
              <Dialog.Content style={styles.container}>
                <TextInput
                  label="Exercise name"
                  value={exerciseName}
                  onChangeText={(reps) => setExerciseName(reps)}
                  style={styles.textBox}
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
