import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Paragraph } from "react-native-paper";
import { useExerciseSets } from "../data/exerciseSetsProvider";
import { IdExerciseSet } from "../data/types";

export default function ExerciseGraph({ route, navigation }: any) {
  const { exerciseSets } = useExerciseSets();

  if (exerciseSets.length === 0) {
    return (
      <View style={styles.container}>
        <Paragraph>Log some sets and come back to view your charts</Paragraph>
      </View>
    );
  }

  return (
    <LineChart
      data={{
        labels: exerciseSets.map((set: IdExerciseSet) => set.timestamp.toLocaleDateString()),
        datasets: [
          {
            data: exerciseSets.map((set: IdExerciseSet) => set.weight * set.reps),
          },
        ],
      }}
      width={Dimensions.get("window").width} // from react-native
      height={220}
      yAxisSuffix="lbs"
      yAxisInterval={1} // optional, defaults to 1
      chartConfig={{
        backgroundColor: "#e26a00",
        backgroundGradientFrom: "#fb8c00",
        backgroundGradientTo: "#ffa726",
        decimalPlaces: 0, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
          borderRadius: 16,
        },
        propsForDots: {
          r: "6",
          strokeWidth: "2",
          stroke: "#ffa726",
        },
      }}
      bezier
      style={{
        margin: 8,
        borderRadius: 0,
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
