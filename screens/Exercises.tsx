import React, { useEffect, useMemo } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { FAB, List, Paragraph, Searchbar } from "react-native-paper";
import { useExercises } from "../data/exercisesProvider";

export default function Exercises({ navigation }: any) {
  const showDialog = () => {
    navigation.push("Add Exercise");
  };

  const { loadExercises, exercises, useExercise } = useExercises();

  const [searchQuery, setSearchQuery] = React.useState("");

  useEffect(() => {
    loadExercises();
  }, []);

  return useMemo(
    () => (
      <KeyboardAvoidingView
        behavior="padding"
        enabled
        keyboardVerticalOffset={100}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <>
            <Searchbar
              placeholder="Search"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <FlatList
              data={exercises.filter((e) =>
                e.name.toLowerCase().includes(searchQuery.toLowerCase())
              )}
              renderItem={({ item }) => (
                <List.Item
                  title={item.name}
                  description={
                    item.timestamp ? item.timestamp.toLocaleDateString() : ""
                  }
                  onPress={() => {
                    useExercise(item);
                    navigation.push("Exercise Log", {
                      defaultName: item.name,
                      defaultId: item.id,
                    });
                  }}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
            />

            {exercises.length === 0 && (
              <View style={{ flex: 1, alignItems: "center" }}>
                <Paragraph>
                  Click the plus to create your first exercise!
                </Paragraph>
              </View>
            )}

            <FAB style={styles.fab} icon="plus" onPress={showDialog} />
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    ),
    [exercises, searchQuery]
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 8,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
