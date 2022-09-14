import React, { useCallback, useEffect, useState } from "react";
import { useExerciseSets } from "../data/exerciseSetsProvider";
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
} from "react-native-reanimated";
import { TextInput, View } from "react-native";
import { Chip, Paragraph, ToggleButton, Text } from "react-native-paper";
import CustomLineChart from "../components/chart/IndividuallyScaledLineChart";
import { IdExerciseSet } from "../data/types";

const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
Animated.addWhitelistedNativeProps({ text: true });

const spring = {
  overshootClamping: true,
  stiffness: 300,
  damping: 20,
};

// analogous colors
const loadColor = "hsla(60, 50%, 50%, 1)";
const loadFill = "hsla(60, 50%, 50%, 0.2)";
const weightColor = "hsla(90, 50%, 50%, 1)";
const weightFill = "hsla(90, 50%, 50%, 0.2)";
const repsColor = "hsla(30, 50%, 50%, 1)";
const repsFill = "hsla(30, 50%, 50%, 0.2)";

export default function ExerciseGraph({ route, navigation }: any) {
  const exerciseSets = useExerciseSets().exerciseSets.reverse();
  const panRef = React.useRef();

  const onLayout = useCallback((event) => {
    const { width, height } = event.nativeEvent.layout;
    setScreenWidth(width);
    setScreenHeight(height);
  }, []);

  let [filteredSets, setFilteredSets] = useState<{
    [key: string]: IdExerciseSet[];
  }>({
    all: exerciseSets,
    year: [],
    "6month": [],
    month: [],
    week: [],
    day: [],
  });

  const [animating, setAnimating] = useState(false);

  const [avgReps, setAvgReps] = useState(0);
  const [avgWeight, setAvgWeight] = useState(0);
  const [avgLoad, setAvgLoad] = useState(0);

  const [minDate, setMinDate] = useState(
    new Date(Math.min(...exerciseSets.map((set) => set.timestamp.valueOf())))
  );

  const maxDate = new Date(
    Math.max(...exerciseSets.map((set) => set.timestamp.valueOf()))
  );

  const [data, setData] = useState<any[]>([]);

  const [toggle, setToggle] = useState("all");

  useEffect(() => {
    setFilteredSets({
      all: exerciseSets,
      year: exerciseSets.filter((set) => {
        return set.timestamp.valueOf() > Date.now().valueOf() - 31536000000;
      }),
      "6month": exerciseSets.filter((set) => {
        return set.timestamp.valueOf() > Date.now().valueOf() - 15768000000;
      }),
      month: exerciseSets.filter((set) => {
        return set.timestamp.valueOf() > Date.now().valueOf() - 2592000000;
      }),
      week: exerciseSets.filter((set) => {
        return set.timestamp.valueOf() > Date.now().valueOf() - 604800000;
      }),
      day: exerciseSets.filter((set) => {
        return set.timestamp.valueOf() > Date.now().valueOf() - 86400000;
      }),
    });
  }, [exerciseSets, toggle]);

  useEffect(() => {
    let newData = [];

    newData.push({
      data: filteredSets[toggle].map((set) => set.weight),
      svg: { stroke: weightColor, strokeWidth: 2 },
      areaSvg: { fill: weightFill },
    });

    newData.push({
      data: filteredSets[toggle].map((set) => set.reps),
      svg: { stroke: repsColor, strokeWidth: 2 },
      areaSvg: { fill: repsFill },
    });

    newData.push({
      data: filteredSets[toggle].map((set) => set.weight * set.reps),
      svg: { stroke: loadColor, strokeWidth: 2 },
      areaSvg: { fill: loadFill },
    });

    let reps =
      filteredSets[toggle].reduce((acc, curr) => acc + curr.reps, 0) /
      filteredSets[toggle].length;

    let weight =
      filteredSets[toggle].reduce((acc, curr) => acc + curr.weight, 0) /
      filteredSets[toggle].length;

    let load = reps * weight;

    setAvgReps(reps);
    setAvgWeight(weight);
    setAvgLoad(load);

    setMinDate(
      new Date(
        Math.min(...filteredSets[toggle].map((set) => set.timestamp.valueOf()))
      )
    );
    setData(newData);
  }, [filteredSets, toggle]);

  const [screenWidth, setScreenWidth] = useState(-1);
  const [screenHeight, setScreenHeight] = useState(-1);

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
  }, [screenWidth, exerciseSets]);

  const animatedDateProps = useAnimatedProps(() => {
    let date = new Date(Math.round(timestamp.value));

    return {
      text: `${date.toLocaleDateString()}`,
    } as any;
  }, [screenWidth, exerciseSets]);

  const animatedLoadProps = useAnimatedProps(
    () =>
      ({
        text: `${load.value.toFixed(1)}lbs load`,
      } as any),
    [screenWidth, exerciseSets]
  );

  const animatedRepsProps = useAnimatedProps(
    () =>
      ({
        text: `${reps.value.toFixed(0)} reps`,
      } as any),
    [screenWidth, exerciseSets]
  );

  const animatedWeightProps = useAnimatedProps(
    () =>
      ({
        text: `${weight.value.toFixed(1)}lbs`,
      } as any),
    [screenWidth, exerciseSets]
  );

  const snap = (x: number) => {
    if (screenWidth != -1) {
      let xSnap = screenWidth / (filteredSets[toggle].length - 1);
      let ind = Math.round(x / xSnap);

      // snap x1 and x2 to the nearest xSnap
      x = ind * xSnap;
      let set = filteredSets[toggle][ind];

      if (set) {
        load.value = withSpring(set.weight * set.reps, spring);
        reps.value = withSpring(set.reps, spring);
        weight.value = withSpring(set.weight, spring);
        timestamp.value = withSpring(set.timestamp.valueOf(), spring);
      }
    }

    _touchX.value = x;
  };

  const onPanEvent = (event: GestureEvent<PanGestureHandlerEventPayload>) => {
    snap(event.nativeEvent.x);
  };

  if (exerciseSets.length <= 1) {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <Paragraph>Log at least 2 sets to see your charts</Paragraph>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ToggleButton.Row
        onValueChange={(value) => {
          if (value != null) {
            setToggle(value);
          }
        }}
        value={toggle}
        style={{ alignSelf: "center", margin: 5 }}
      >
        <ToggleButton
          disabled={filteredSets["day"].length <= 1}
          icon={() => <Text>D</Text>}
          value={"day"}
        />
        <ToggleButton
          disabled={filteredSets["week"].length <= 1}
          icon={() => <Text>W</Text>}
          value={"week"}
        />
        <ToggleButton
          disabled={filteredSets["month"].length <= 1}
          icon={() => <Text>M</Text>}
          value={"month"}
        />
        <ToggleButton
          disabled={filteredSets["6month"].length <= 1}
          icon={() => <Text>6M</Text>}
          value={"6month"}
        />
        <ToggleButton
          disabled={filteredSets["year"].length <= 1}
          icon={() => <Text>Y</Text>}
          value={"year"}
        />
        <ToggleButton
          disabled={filteredSets["all"].length <= 1}
          icon={() => <Text>All</Text>}
          value={"all"}
        />
      </ToggleButton.Row>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          padding: 10,
        }}
      >
        <View style={{ flex: 1 }}>
          {animating ? (
            <AnimatedTextInput
              editable={false}
              style={{ color: weightColor }}
              animatedProps={animatedWeightProps}
            />
          ) : (
            <TextInput editable={false} style={{ color: weightColor }}>
              {avgWeight.toFixed(1)}lbs avg
            </TextInput>
          )}
        </View>
        <View style={{ flex: 1 }}>
          {animating ? (
            <AnimatedTextInput
              editable={false}
              style={{ color: repsColor }}
              animatedProps={animatedRepsProps}
            />
          ) : (
            <TextInput editable={false} style={{ color: repsColor }}>
              {avgReps.toFixed(0)} reps avg
            </TextInput>
          )}
        </View>
        <View style={{ flex: 1 }}>
          {animating ? (
            <AnimatedTextInput
              editable={false}
              style={{ color: loadColor }}
              animatedProps={animatedLoadProps}
            />
          ) : (
            <TextInput editable={false} style={{ color: loadColor }}>
              {avgLoad.toFixed(1)}lbs load avg
            </TextInput>
          )}
        </View>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        {animating ? (
          <AnimatedTextInput
            editable={false}
            animatedProps={animatedDateProps}
          />
        ) : (
          <TextInput editable={false}>
            {minDate.toLocaleDateString()}-{maxDate.toLocaleDateString()}
          </TextInput>
        )}
      </View>

      <View onLayout={onLayout} style={{ flex: 1, direction: "rtl" }}>
        <PanGestureHandler
          ref={panRef}
          onGestureEvent={onPanEvent}
          onBegan={() => {
            setAnimating(true);
            opacity.value = 1;
          }}
          onEnded={() => {
            setAnimating(false);
            opacity.value = 0;
          }}
        >
          <Animated.View style={{ height: screenHeight, width: screenWidth }}>
            <CustomLineChart
              style={{ flex: 1 }}
              data={data}
              //contentInset={{ top: 30, bottom: 30 }}
              curve={shape.curveLinear}
              yScale={scale.scaleLinear}
              animate
            >
              <AnimatedLine
                animatedProps={animatedProps}
                y1="0"
                y2={screenHeight}
                strokeWidth="2"
              />
            </CustomLineChart>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </View>
  );
}
