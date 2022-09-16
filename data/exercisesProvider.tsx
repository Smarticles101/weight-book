import * as React from "react";
import { createContext, useReducer } from "react";
import {
  deleteExercise,
  deleteSet,
  getExercises,
  getSets,
  insertExercise,
  insertSet,
  updateExercise,
  updateSet,
} from "./database";
import { Exercise, ExerciseSet, IdExercise, IdExerciseSet } from "./types";

export const Context = createContext({
  exercises: [] as IdExercise[],
  loadExercises: () => {},
  addExercise: (e: Exercise) => {},
  editExercise: (e: IdExercise) => {},
  removeExercise: (id: number) => {},
  setExerciseTimestamp: (id: number, timestamp: Date) => {},
  exerciseSets: [] as IdExerciseSet[],
  addSet: (s: ExerciseSet) => {},
  editSet: (s: IdExerciseSet) => {},
  removeSet: (sId: number) => {},
  useExercise: (e: IdExercise) => {},
  activeExercise: {} as IdExercise,
});

export default function ExercisesProvider({ children }: any) {
  const [exercises, dispatchExercises] = useReducer(
    (state: IdExercise[], action: any) => {
      switch (action.type) {
        case "SET_EXERCISES":
          return action.payload;
        case "ADD_EXERCISE":
          return [...state, action.payload].sort(
            (a, b) =>
              (b.timestamp || 0).valueOf() - (a.timestamp || 0).valueOf()
          );
        case "EDIT_EXERCISE":
          return state.map((exercise: IdExercise) => {
            if (exercise.id === action.payload.id) {
              return {
                ...exercise,
                ...action.payload,
              };
            }
            return exercise;
          });
        case "REMOVE_EXERCISE":
          return state.filter(
            (exercise: IdExercise) => exercise.id !== action.payload.id
          );
        case "SET_EXERCISE_TIMESTAMP":
          return state
            .map((exercise: IdExercise) => {
              if (exercise.id === action.payload.id) {
                return {
                  ...exercise,
                  timestamp: action.payload.timestamp,
                };
              }
              return exercise;
            })
            .sort(
              (a, b) =>
                (b.timestamp || 0).valueOf() - (a.timestamp || 0).valueOf()
            );
      }
    },
    []
  );

  const addExercise = (exercise: Exercise) => {
    insertExercise(exercise, (exercise) => {
      dispatchExercises({
        type: "ADD_EXERCISE",
        payload: exercise,
      });
    });
  };

  const loadExercises = () => {
    getExercises((exercises) => {
      dispatchExercises({
        type: "SET_EXERCISES",
        payload: exercises,
      });
    });
  };

  const editExercise = (exercise: IdExercise) => {
    updateExercise(exercise, (exercise) => {
      dispatchExercises({
        type: "EDIT_EXERCISE",
        payload: exercise,
      });
    });
  };

  const removeExercise = (exerciseId: number) => {
    deleteExercise(exerciseId, () => {
      dispatchExercises({
        type: "REMOVE_EXERCISE",
        payload: { id: exerciseId },
      });
    });
  };

  const setExerciseTimestamp = (exerciseId: number, timestamp: Date) => {
    dispatchExercises({
      type: "SET_EXERCISE_TIMESTAMP",
      payload: { id: exerciseId, timestamp },
    });
  };

  const [activeExercise, setActiveExercise] = React.useState<IdExercise>({
    name: "",
    id: 0,
    description: "",
  });

  const [sets, dispatchSets] = useReducer(
    (state: IdExerciseSet[], action: any) => {
      let s: IdExerciseSet[];
      switch (action.type) {
        case "SET_SETS":
          return action.payload;
        case "ADD_SET":
          s = [...state, action.payload].sort(
            (a, b) => b.timestamp.valueOf() - a.timestamp.valueOf()
          );
          setExerciseTimestamp(activeExercise.id, s[0].timestamp);
          return s;
        case "EDIT_SET":
          s = state
            .map((set: any) => {
              if (set.id === action.payload.id) {
                return {
                  ...set,
                  ...action.payload,
                };
              }
              return set;
            })
            .sort(
              (a: IdExerciseSet, b: IdExerciseSet) =>
                b.timestamp.valueOf() - a.timestamp.valueOf()
            );
          setExerciseTimestamp(activeExercise.id, s[0].timestamp);
          return s;
        case "REMOVE_SET":
          s = state.filter((set: any) => set.id !== action.payload);
          setExerciseTimestamp(activeExercise.id, s[0].timestamp);
          return s;
        default:
          return state;
      }
    },
    []
  );

  const addSet = (set: ExerciseSet) => {
    if (activeExercise) {
      insertSet(activeExercise.id, set, (set) => {
        dispatchSets({ type: "ADD_SET", payload: set });
      });
    }
  };

  const editSet = (set: IdExerciseSet) => {
    updateSet(set, (set) => {
      dispatchSets({ type: "EDIT_SET", payload: set });
    });
  };

  const removeSet = (setId: number) => {
    deleteSet(setId, (setId: number) => {
      dispatchSets({ type: "REMOVE_SET", payload: setId });
    });
  };

  const useExercise = (exercise: IdExercise) => {
    getSets(exercise.id, (sets: any) => {
      setActiveExercise(exercise);
      dispatchSets({ type: "SET_SETS", payload: sets });
    });
  };

  return (
    <Context.Provider
      value={{
        exercises,
        loadExercises,
        addExercise,
        editExercise,
        removeExercise,
        setExerciseTimestamp,
        exerciseSets: sets,
        addSet,
        editSet,
        removeSet,
        useExercise,
        activeExercise: activeExercise,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useExercises = () => React.useContext(Context);
