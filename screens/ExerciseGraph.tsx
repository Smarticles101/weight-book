import React, { useEffect, useState } from "react";
import { useExerciseSets } from "../data/exerciseSetsProvider";
import { Grid } from "react-native-svg-charts";
import * as shape from "d3-shape";
import * as scale from "d3-scale";
import { Line } from "react-native-svg";
import {
  GestureEvent,
  LongPressGestureHandler,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  State,
  TapGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { TextInput, View } from "react-native";
import { Chip, Paragraph } from "react-native-paper";
import CustomLineChart from "../components/chart/IndividuallyScaledLineChart";

const AnimatedLine = Animated.createAnimatedComponent(Line);

// analogous colors
const loadColor = "hsla(60, 50%, 50%, 0.75)";
const weightColor = "hsla(90, 50%, 50%, 0.75)";
const repsColor = "hsla(30, 50%, 50%, 0.75)";

// TODO:
//     toFixed should use the precision of the number we are working towards
//     but for now, we'll just use 0
//
//     Groupings of time, view individual months, weeks, etc.
//     Should we limit the number of data points? and how?
//
//     This file is gross, can we clean it up?
//
//     Animations are weird in development

export default function ExerciseGraph({ route, navigation }: any) {
  const { exerciseSets: unsortedSets } = useExerciseSets();
  const panRef = React.useRef();
  const longPressRef = React.useRef();
  const tapRef = React.useRef();

  const [exerciseSets, setExerciseSets] = useState(unsortedSets);

  const [panning, setPanning] = useState(false);

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    unsortedSets.sort((a, b) => {
      return a.timestamp.valueOf() - b.timestamp.valueOf();
    });
    setExerciseSets(unsortedSets);
  }, [unsortedSets]);

  useEffect(() => {
    let newData = [];
    newData.push({
      data: exerciseSets.map((set) => set.weight),
      svg: { stroke: weightColor, strokeWidth: 5 },
    });
    newData.push({
      data: exerciseSets.map((set) => set.reps),
      svg: { stroke: repsColor, strokeWidth: 5 },
    });
    newData.push({
      data: exerciseSets.map((set) => set.weight * set.reps),
      svg: { stroke: loadColor, strokeWidth: 5 },
    });
    setData(newData);
  }, [exerciseSets]);

  const [width, setWidth] = useState(-1);

  const _touchX = useSharedValue(0);
  const opacity = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => {
    let x1 = _touchX.value;
    let x2 = _touchX.value;

    return {
      x1,
      x2,
      stroke: `rgba(134, 65, 244, ${opacity.value})`,
    };
  }, [width, exerciseSets]);

  const snap = (x: number) => {
    if (width != -1) {
      let xSnap = width / (exerciseSets.length - 1);
      let ind = Math.round(x / xSnap);

      // snap x1 and x2 to the nearest xSnap
      x = ind * xSnap;
      let set = exerciseSets[ind];
    }

    _touchX.value = x;
  };

  const onPanEvent = (event: GestureEvent<PanGestureHandlerEventPayload>) => {
    if (panning) {
      snap(event.nativeEvent.x);
    }
  };

  if (exerciseSets.length <= 1) {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <Paragraph>Log at least 2 sets to see your charts</Paragraph>
      </View>
    );
  }

  return (
    // hold and drag to pan across data points, otherwise tap to select
    // or pan to change visible range

    // TODO:
    //     how do we pan across the date range?
    //     once that's found out, we can figure out if we need to use a fling gesture handler too.
    //
    //     instead of showing the data as text, lets use some kind of window with the svg
    <PanGestureHandler
      ref={panRef}
      simultaneousHandlers={longPressRef}
      onGestureEvent={onPanEvent}
      onBegan={() => {
        if (panning) {
          opacity.value = 1;
        } else {
          opacity.value = 0;
        }
      }}
      onEnded={() => {
        opacity.value = 0;
      }}
    >
      <LongPressGestureHandler
        ref={longPressRef}
        simultaneousHandlers={panRef}
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.ACTIVE) {
            setPanning(true);
          } else if (nativeEvent.state === State.END) {
            setPanning(false);
          }
        }}
      >
        <TapGestureHandler
          ref={tapRef}
          onHandlerStateChange={({ nativeEvent }) => {
            if (nativeEvent.state === State.ACTIVE) {
              snap(nativeEvent.x);
              opacity.value = 1;
            }
          }}
        >
          <Animated.View style={{ height: 200, width: width }}>
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
          </Animated.View>
        </TapGestureHandler>
      </LongPressGestureHandler>
    </PanGestureHandler>
  );
}

// this is dumb, but it works \o/
const WidthSetter = (props: any) => {
  const { width, setWidth } = props;
  useEffect(() => setWidth(width), [width]);
  return null;
};
