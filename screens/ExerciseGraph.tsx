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
  withDecay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedLine = Animated.createAnimatedComponent(Line);

export default function ExerciseGraph({ route, navigation }: any) {
  const { exerciseSets } = useExerciseSets();
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

  const onGestureEvent = (event: GestureEvent<PanGestureHandlerEventPayload>) => {
    let x = event.nativeEvent.x;

    if (width != -1) {
      let xSnap = width / (exerciseSets.length - 1);
      let ind = Math.round(x / xSnap);

      // snap x1 and x2 to the nearest xSnap
      x = ind * xSnap;
    }

    _touchX.value = withSpring(x, {
      overshootClamping: true,
    });
  }

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onBegan={() => (opacity.value = withTiming(1))}
      onEnded={() => (opacity.value = withTiming(0))}
    >
      <Animated.View style={{ height: 200, padding: 10 }}>
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
