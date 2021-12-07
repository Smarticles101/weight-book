import React, { useEffect, useState } from "react";
import { useExerciseSets } from "../data/exerciseSetsProvider";
import { Grid } from "react-native-svg-charts";
import * as shape from "d3-shape";
import * as scale from "d3-scale";
import { Line } from "react-native-svg";
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { TextInput, View } from "react-native";
import { Chip } from "react-native-paper";
import CustomLineChart from "../components/chart/IndividuallyScaledLineChart";

const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
Animated.addWhitelistedNativeProps({ text: true });

const spring = {
  overshootClamping: true,
  stiffness: 300,
  damping: 20,
};

// analogous colors
const loadColor = "hsla(60, 50%, 50%, 0.75)";
const weightColor = "hsla(90, 50%, 50%, 0.75)";
const repsColor = "hsla(30, 50%, 50%, 0.75)";

// TODO:
//     toFixed should use the precision of the number we are working towards
//     but for now, we'll just use 0
//
//     Selectable graph plots, stack the data
//     Color code the plot to each data set (use color instead of labels)
//     Format better. Date on top, load, reps, weight on same line
//
//     Groupings of time, view individual months, weeks, etc.
//     Should we limit the number of data points? and how?

export default function ExerciseGraph({ route, navigation }: any) {
  const { exerciseSets: unsortedSets } = useExerciseSets();

  const [exerciseSets, setExerciseSets] = useState(unsortedSets);

  const [weightToggle, setWeightToggle] = useState(true);
  const [repsToggle, setRepsToggle] = useState(true);
  const [loadToggle, setLoadToggle] = useState(true);

  const toggleWeight = () => setWeightToggle(!weightToggle);
  const toggleReps = () => setRepsToggle(!repsToggle);
  const toggleLoad = () => setLoadToggle(!loadToggle);

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    unsortedSets.sort((a, b) => {
      return a.timestamp.valueOf() - b.timestamp.valueOf();
    });
    setExerciseSets(unsortedSets);
  }, [unsortedSets]);

  useEffect(() => {
    let newData = [];
    if (weightToggle) {
      newData.push({
        data: exerciseSets.map((set) => set.weight),
        svg: { stroke: weightColor, strokeWidth: 5 },
      });
    }
    if (repsToggle) {
      newData.push({
        data: exerciseSets.map((set) => set.reps),
        svg: { stroke: repsColor, strokeWidth: 5 },
      });
    }
    if (loadToggle) {
      newData.push({
        data: exerciseSets.map((set) => set.weight * set.reps),
        svg: { stroke: loadColor, strokeWidth: 5 },
      });
    }
    setData(newData);
  }, [exerciseSets, weightToggle, repsToggle, loadToggle]);

  const [width, setWidth] = useState(-1);

  const _touchX = useSharedValue(0);
  const opacity = useSharedValue(0);

  const load = useSharedValue(0);
  const reps = useSharedValue(0);
  const weight = useSharedValue(0);
  const timestamp = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => {
    let x1 = _touchX.value;
    let x2 = _touchX.value;

    return {
      x1,
      x2,
      stroke: `rgba(134, 65, 244, ${opacity.value})`,
    };
  }, [width, exerciseSets]);

  const animatedDateProps = useAnimatedProps(() => {
    let date = new Date(Math.round(timestamp.value));

    return {
      text: `${date.toLocaleDateString()}`,
    } as any;
  }, [width, exerciseSets]);

  const animatedLoadProps = useAnimatedProps(
    () =>
      ({
        text: `${load.value.toFixed(0)}lbs`,
      } as any),
    [width, exerciseSets]
  );

  const animatedRepsProps = useAnimatedProps(
    () =>
      ({
        text: `${reps.value.toFixed(0)}`,
      } as any),
    [width, exerciseSets]
  );

  const animatedWeightProps = useAnimatedProps(
    () =>
      ({
        text: `${weight.value.toFixed(0)}lbs`,
      } as any),
    [width, exerciseSets]
  );

  const onGestureEvent = (
    event: GestureEvent<PanGestureHandlerEventPayload>
  ) => {
    let x = event.nativeEvent.x;

    if (width != -1) {
      let xSnap = width / (exerciseSets.length - 1);
      let ind = Math.round(x / xSnap);

      // snap x1 and x2 to the nearest xSnap
      x = ind * xSnap;
      let set = exerciseSets[ind];

      if (set) {
        load.value = withSpring(set.weight * set.reps, spring);
        reps.value = withSpring(set.reps, spring);
        weight.value = withSpring(set.weight, spring);
        timestamp.value = withSpring(set.timestamp.valueOf(), spring);
      }
    }

    _touchX.value = withSpring(x, spring);
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onBegan={() => (opacity.value = withTiming(1))}
      onEnded={() => (opacity.value = withTiming(0))}
    >
      <Animated.View style={{ padding: 10 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            padding: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <Chip
              selected={weightToggle}
              onPress={toggleWeight}
              style={{ height: 32 }}
            >
              Weight
            </Chip>
            {weightToggle && (
              <AnimatedTextInput
                editable={false}
                style={{ color: weightColor }}
                animatedProps={animatedWeightProps}
              />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Chip
              selected={repsToggle}
              onPress={toggleReps}
              style={{ height: 32 }}
            >
              Reps
            </Chip>
            {repsToggle && (
              <AnimatedTextInput
                editable={false}
                style={{ color: repsColor }}
                animatedProps={animatedRepsProps}
              />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Chip
              selected={loadToggle}
              onPress={toggleLoad}
              style={{ height: 32 }}
            >
              Load
            </Chip>
            {loadToggle && (
              <AnimatedTextInput
                editable={false}
                style={{ color: loadColor }}
                animatedProps={animatedLoadProps}
              />
            )}
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <AnimatedTextInput
            editable={false}
            animatedProps={animatedDateProps}
          />
        </View>

        <View style={{ height: 200, width: width }}>
          <CustomLineChart
            style={{ flex: 1 }}
            data={data}
            contentInset={{ top: 30, bottom: 30 }}
            curve={shape.curveLinear}
            yScale={scale.scaleLinear}
            animate
          >
            <WidthSetter setWidth={setWidth} />
            <Grid />

            <AnimatedLine
              animatedProps={animatedProps}
              y1="0"
              y2="200"
              strokeWidth="2"
            />
          </CustomLineChart>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
}

// this is dumb, but it works \o/
const WidthSetter = (props: any) => {
  const { width, setWidth } = props;
  useEffect(() => setWidth(width), [width]);
  return null;
};
