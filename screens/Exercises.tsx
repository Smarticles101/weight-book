import React, { useEffect, useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { FAB, List, Paragraph } from "react-native-paper";
import { useExerciseSets } from "../data/exerciseSetsProvider";
import { useExercises } from "../data/exercisesProvider";

export default function Exercises({ navigation }: any) {
  const { useExercise } = useExerciseSets();
  const showDialog = () => {
    navigation.push("Add Exercise");
  };

  const { loadExercises, exercises } = useExercises();

  useEffect(() => {
    loadExercises();
  }, []);

  return useMemo(
    () => (
      <>
        <FlatList
          data={exercises}
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
            <Paragraph>Click the plus to create your first exercise!</Paragraph>
          </View>
        )}

        <FAB style={styles.fab} icon="plus" onPress={showDialog} />
      </>
    ),
    [exercises]
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
