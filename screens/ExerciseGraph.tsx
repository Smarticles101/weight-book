import React, { useEffect, useState } from "react";
import { useExerciseSets } from "../data/exerciseSetsProvider";
import { AreaChart, Grid } from "react-native-svg-charts";
import * as shape from "d3-shape";
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

const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
Animated.addWhitelistedNativeProps({ text: true });

const spring = {
  overshootClamping: true,
  stiffness: 300,
  damping: 20,
};

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

  useEffect(() => {
    unsortedSets.sort((a, b) => {
      return a.timestamp.valueOf() - b.timestamp.valueOf();
    });
    setExerciseSets(unsortedSets);
  }, [unsortedSets]);

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
        text: `Load ${load.value.toFixed(0)}lbs`,
      } as any),
    [width, exerciseSets]
  );

  const animatedRepsProps = useAnimatedProps(
    () =>
      ({
        text: `Reps ${reps.value.toFixed(0)}`,
      } as any),
    [width, exerciseSets]
  );

  const animatedWeightProps = useAnimatedProps(
    () =>
      ({
        text: `Weight ${weight.value.toFixed(0)}lbs`,
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

      load.value = withSpring(set.weight * set.reps, spring);
      reps.value = withSpring(set.reps, spring);
      weight.value = withSpring(set.weight, spring);
      timestamp.value = withSpring(set.timestamp.valueOf(), spring);
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
        <AnimatedTextInput editable={false} animatedProps={animatedDateProps} />
        <AnimatedTextInput editable={false} animatedProps={animatedLoadProps} />
        <AnimatedTextInput editable={false} animatedProps={animatedRepsProps} />
        <AnimatedTextInput
          editable={false}
          animatedProps={animatedWeightProps}
        />

        <View style={{ height: 200, width: width }}>
          <AreaChart
            style={{ flex: 1 }}
            data={exerciseSets}
            yAccessor={({ item }) => item.weight * item.reps}
            contentInset={{ top: 30, bottom: 30 }}
            curve={shape.curveLinear}
            svg={{ fill: "rgba(134, 65, 244, 0.8)" }}
          >
            <WidthSetter setWidth={setWidth} />
            <Grid />

            <AnimatedLine
              animatedProps={animatedProps}
              y1="0"
              y2="200"
              strokeWidth="2"
            />
          </AreaChart>
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
