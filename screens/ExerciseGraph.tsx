import React, { useCallback, useEffect, useState } from "react";
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
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { TextInput, View } from "react-native";
import { Chip, Paragraph, ToggleButton, Text } from "react-native-paper";
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

  const onLayout = useCallback((event) => {
    const { width, height } = event.nativeEvent.layout;
    setScreenWidth(width);
  }, []);

  const [exerciseSets, setExerciseSets] = useState(unsortedSets);

  const [selecting, setSelecting] = useState(false);

  const [data, setData] = useState<any[]>([]);

  const [screens, setScreens] = useState<number>(0);

  useEffect(() => {
    unsortedSets.sort((a, b) => {
      return a.timestamp.valueOf() - b.timestamp.valueOf();
    });
    setExerciseSets(unsortedSets);
  }, [unsortedSets]);

  useEffect(() => {
    let newData = [];
    newData.push({
      data: exerciseSets.map((set) => ({
        y: set.weight,
        x: set.timestamp,
      })),
      svg: { stroke: weightColor, strokeWidth: 5 },
    });
    newData.push({
      data: exerciseSets.map((set) => ({
        y: set.reps,
        x: set.timestamp,
      })),
      svg: { stroke: repsColor, strokeWidth: 5 },
    });
    newData.push({
      data: exerciseSets.map((set) => ({
        y: set.weight * set.reps,
        x: set.timestamp,
      })),
      svg: { stroke: loadColor, strokeWidth: 5 },
    });
    setData(newData);

    if (exerciseSets.length > 0) {
      setScreens(
        (exerciseSets[exerciseSets.length - 1].timestamp.getTime() -
          exerciseSets[0].timestamp.getTime()) /
          route.params.screenDateLengthMs
      );
    }
  }, [exerciseSets]);

  const [screenWidth, setScreenWidth] = useState(-1);

  const _touchX = useSharedValue(0);
  const _dragX = useSharedValue(0);
  const _transformX = useSharedValue(0);
  const _velocityX = useSharedValue(0);
  const opacity = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => {
    let x1 = _touchX.value;
    let x2 = _touchX.value;

    return {
      x1,
      x2,
      stroke: `rgba(134, 65, 244, ${opacity.value})`,
    };
  }, [screenWidth, exerciseSets]);

  const snap = (x: number) => {
    if (screenWidth != -1 && screens != 0) {
      let xSnap = (screenWidth * screens) / (exerciseSets.length - 1);
      let ind = Math.round(x / xSnap);

      // snap x1 and x2 to the nearest xSnap
      x = ind * xSnap;
      let set = exerciseSets[ind];
    }

    _touchX.value = x;
  };

  const onPanEvent = (event: GestureEvent<PanGestureHandlerEventPayload>) => {
    if (selecting) {
      snap(event.nativeEvent.x);
    } else {
      _velocityX.value = event.nativeEvent.velocityX;
      _dragX.value = event.nativeEvent.translationX;
    }
  };

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: _transformX.value + _dragX.value }],
    };
  });
  const [toggle, setToggle] = useState("year");

  if (exerciseSets.length <= 1) {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <Paragraph>Log at least 2 sets to see your charts</Paragraph>
      </View>
    );
  }

  return (
    // fling to move farther across the graph, one or more screens at a time
    // pan to move across the date range one pixel at a time
    // tap to see the exact value at that point
    // long press to pan over the data points and see the exact value at that point

    <View>
      <ToggleButton.Row
        onValueChange={(value) => {
          if (value != null) {
            setToggle(value);
          }
        }}
        value={toggle}
        style={{ alignSelf: "center", margin: 5 }}
      >
        <ToggleButton icon={() => <Text>D</Text>} value={"day"} />
        <ToggleButton icon={() => <Text>W</Text>} value={"week"} />
        <ToggleButton icon={() => <Text>M</Text>} value={"month"} />
        <ToggleButton icon={() => <Text>6M</Text>} value={"6month"} />
        <ToggleButton icon={() => <Text>Y</Text>} value={"year"} />
      </ToggleButton.Row>

      <View onLayout={onLayout} style={{ direction: "rtl" }}>
        <PanGestureHandler
          ref={panRef}
          simultaneousHandlers={longPressRef}
          onGestureEvent={onPanEvent}
          onBegan={() => {
            if (selecting) {
              opacity.value = 1;
            } else {
              opacity.value = 0;
            }
          }}
          onEnded={() => {
            opacity.value = 0;
            //console.log(_velocityX.value);

            _transformX.value = _transformX.value + _dragX.value;
            _dragX.value = 0;

            if (Math.abs(_velocityX.value) > 1000) {
              _transformX.value = withTiming(
                _transformX.value + _velocityX.value * 0.5,
                { easing: Easing.out(Easing.circle) }
              );
            }

            _velocityX.value = 0;
          }}
        >
          <LongPressGestureHandler
            ref={longPressRef}
            simultaneousHandlers={panRef}
            onHandlerStateChange={({ nativeEvent }) => {
              if (nativeEvent.state === State.ACTIVE) {
                setSelecting(true);
                snap(nativeEvent.x);
              } else if (nativeEvent.state === State.END) {
                setSelecting(false);
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
              <Animated.View
                style={[
                  { height: 200, width: screenWidth * screens },
                  animatedStyles,
                ]}
              >
                <CustomLineChart
                  style={{ flex: 1 }}
                  data={data}
                  contentInset={{ top: 30, bottom: 30 }}
                  curve={shape.curveLinear}
                  yScale={scale.scaleLinear}
                  xScale={scale.scaleTime}
                  animate
                  yAccessor={({ item }: any) => item.y}
                  xAccessor={({ item }: any) => item.x}
                >
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
      </View>
    </View>
  );
}
