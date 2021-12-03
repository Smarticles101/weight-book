import React, { useLayoutEffect } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useExerciseSets } from "../data/exerciseSetsProvider";
import { IdExerciseSet } from "../data/types";

export default function ExerciseGraph({ route, navigation }: any) {
  const { exerciseSets } = useExerciseSets();
  
  return (
    <>
      <LineChart
        data={{
          labels: exerciseSets.map((set: IdExerciseSet) => set.timestamp.toDateString()),
          datasets: [
            {
              data: [
                // is weight * reps a good indicator for load?
                ...exerciseSets.map((set: IdExerciseSet) => set.weight * set.reps),
              ],
            },
            /*{
              data: [
                ...exerciseSets.map((set: IdExerciseSet) => set.weight),
              ],
            },
            {
              data: [
                ...exerciseSets.map((set: IdExerciseSet) => set.reps),
              ],
            }*/
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
    </>
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
  dataTable: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
});
