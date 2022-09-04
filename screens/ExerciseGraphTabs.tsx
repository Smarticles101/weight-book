import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ExerciseGraph from "./ExerciseGraph";

const Tab = createMaterialTopTabNavigator();

export default function ExerciseGraphTabs({ route, navigation }: any) {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="D"
        component={ExerciseGraph}
        initialParams={{ screenDateLengthMs: 86400000 }}
      />
      <Tab.Screen
        name="W"
        component={ExerciseGraph}
        initialParams={{ screenDateLengthMs: 604800000 }}
      />
      <Tab.Screen
        name="M"
        component={ExerciseGraph}
        initialParams={{ screenDateLengthMs: 2628000000 }}
      />
      <Tab.Screen
        name="6M"
        component={ExerciseGraph}
        initialParams={{ screenDateLengthMs: 15768000000 }}
      />
      <Tab.Screen
        name="Y"
        component={ExerciseGraph}
        initialParams={{ screenDateLengthMs: 31536000000 }}
      />
    </Tab.Navigator>
  );
}
