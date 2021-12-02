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
  Paragraph,
  Portal,
  TextInput,
} from "react-native-paper";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import { useExerciseSets } from "../data/exerciseSetsProvider";

export default function EditSet({ navigation, route }: any) {
  const [reps, setReps] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [timestamp, setTimestamp] = React.useState<Date>(new Date());

  const [deleteDialogVisible, setDeleteDialogVisible] = React.useState(false);
  const [datePickerVisible, setDatePickerVisible] = React.useState(false);
  const [timePickerVisible, setTimePickerVisible] = React.useState(false);

  const { setId, startReps, startWeight, startNotes, startTimestamp } =
    route.params;

  const { editSet, removeSet } = useExerciseSets();

  useEffect(() => {
    setReps(startReps);
    setWeight(startWeight);
    setNotes(startNotes);
    setTimestamp(timestamp);
  }, []);

  const close = () => {
    //onDismiss();
    setReps("");
    setWeight("");
    setNotes("");
    setTimestamp(new Date());
    navigation.goBack();
  };

  const submit = () => {
    editSet({
      id: setId,
      reps: parseInt(reps) || 0,
      weight: parseInt(weight) || 0,
      notes,
      timestamp,
    });
    close();
  };

  const showDeleteConfirm = () => {
    setDeleteDialogVisible(true);
  };
  const closeDeleteConfirm = () => {
    setDeleteDialogVisible(false);
    deleteSet();
  };

  const deleteSet = () => {
    removeSet(setId);
    close();
  };

  const openDatePicker = () => {
    setDatePickerVisible(true);
  };
  const closeDatePicker = () => {
    setDatePickerVisible(false);
  };
  const openTimePicker = () => {
    setTimePickerVisible(true);
  };
  const closeTimePicker = () => {
    setTimePickerVisible(false);
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
          <DatePickerModal
            locale="en"
            mode="single"
            visible={datePickerVisible}
            onDismiss={closeDatePicker}
            date={timestamp}
            validRange={{ startDate: new Date(0) }}
            onConfirm={({ date }) => {
              if (date) {
                let newDate = new Date(timestamp);
                newDate.setDate(date.getDate());
                newDate.setMonth(date.getMonth());
                newDate.setFullYear(date.getFullYear());
                setTimestamp(newDate);
              }

              closeDatePicker();
            }}
          />
          <TimePickerModal
            locale="en"
            visible={timePickerVisible}
            onDismiss={closeTimePicker}
            hours={timestamp.getHours()}
            minutes={timestamp.getMinutes()}
            onConfirm={({ hours, minutes }) => {
              let newDate = new Date(timestamp);
              newDate.setHours(hours);
              newDate.setMinutes(minutes);
              setTimestamp(newDate);

              closeTimePicker();
            }}
          />
          <Dialog visible={deleteDialogVisible} onDismiss={closeDeleteConfirm}>
            {/* @ts-ignore */}
            <Dialog.Title>Delete set?</Dialog.Title>
            <Dialog.Content>
              <Paragraph>Are you sure you want to delete this set?</Paragraph>
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
                    right={<TextInput.Affix text="lbs" />}
                  />
                  <View style={styles.dateTimeInputContainer}>
                    <TextInput
                      label="Date"
                      value={timestamp.toLocaleDateString()}
                      style={styles.dateTimeInput}
                      right={
                        <TextInput.Icon
                          name="calendar"
                          onPress={openDatePicker}
                        />
                      }
                      editable={false}
                    />
                    <TextInput
                      label="Time"
                      value={timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      style={{ ...styles.dateTimeInput, marginLeft: 10 }}
                      right={
                        <TextInput.Icon name="clock" onPress={openTimePicker} />
                      }
                      editable={false}
                    />
                  </View>
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
      </>
    ),
    [
      reps,
      weight,
      notes,
      deleteDialogVisible,
      datePickerVisible,
      timePickerVisible,
      timestamp,
    ]
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
  dateTimeInputContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  dateTimeInput: {
    flex: 1,
  },
});
