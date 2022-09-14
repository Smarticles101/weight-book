import firestore from "@react-native-firebase/firestore";
import React, { useEffect, useLayoutEffect, useMemo } from "react";
import {
  Keyboard,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import {
  TextInput,
  Dialog,
  Appbar,
  HelperText,
  List,
} from "react-native-paper";
import { useExercises } from "../data/exercisesProvider";
import functions from "@react-native-firebase/functions";

export default function AddSet({ navigation, route }: any) {
  const [exerciseName, setExerciseName] = React.useState("");

  const [exerciseNameEmptyErr, setExerciseNameEmptyErr] = React.useState(false);
  const [exerciseNameExistsErr, setExerciseNameExistsErr] =
    React.useState(false);

  const { addExercise, exercises } = useExercises();

  const [suggestedExercises, setSuggestedExercises] = React.useState<any[]>([]);
  const [filteredExercises, setFilteredExercises] = React.useState<any[]>([]);

  useEffect(() => {
    // get approved exercises
    firestore()
      .collection("exercises")
      .where("approved", "==", true)
      .orderBy("count", "desc")
      .get()
      .then((querySnapshot) => {
        const exercises = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSuggestedExercises(exercises);
        setFilteredExercises(exercises);
      });
  }, []);

  const capitalize = (s: string) => {
    if (typeof s !== "string") return "";
    return s
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const close = () => {
    navigation.goBack();
  };

  const submit = () => {
    if (exerciseName.length > 0) {
      if (!exerciseNameExistsErr) {
        addExercise({ name: exerciseName, description: "" });
        functions().httpsCallable("createExercise")({ exercise: exerciseName });
        close();
      }
    } else {
      setExerciseNameEmptyErr(true);
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
                <HelperText
                  type="error"
                  visible={exerciseNameEmptyErr || exerciseNameExistsErr}
                >
                  {exerciseNameEmptyErr
                    ? "Exercise name is required"
                    : "An exercise with this name already exists"}
                </HelperText>
                <TextInput
                  label="Exercise name"
                  value={exerciseName}
                  onChangeText={(exercise) => {
                    setExerciseNameEmptyErr(exercise.length === 0);
                    setExerciseNameExistsErr(
                      exercises.some(
                        (ex) =>
                          ex.name.trim().toLowerCase() ===
                          exercise.toLowerCase()
                      )
                    );
                    setExerciseName(exercise);
                    setFilteredExercises(
                      suggestedExercises.filter((e) =>
                        e.id.toLowerCase().includes(exercise.toLowerCase())
                      )
                    );
                  }}
                  style={styles.textBox}
                  error={exerciseNameEmptyErr}
                />
                {filteredExercises.map((e) => (
                  <List.Item
                    key={e.id}
                    title={capitalize(e.id)}
                    onPress={() => {
                      setExerciseNameEmptyErr(e.id.length === 0);
                      setExerciseNameExistsErr(
                        exercises.some(
                          (ex) => ex.name.trim().toLowerCase() === e.id
                        )
                      );
                      setExerciseName(capitalize(e.id));
                      setFilteredExercises([]);
                    }}
                  />
                ))}
              </Dialog.Content>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    ),
    [exerciseName, filteredExercises]
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
