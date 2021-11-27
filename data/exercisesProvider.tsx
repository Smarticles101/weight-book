import * as React from "react";
import { createContext, useReducer } from "react";
import {
  deleteExercise,
  getExercises,
  insertExercise,
  updateExercise,
} from "./database";
import { Exercise, IdExercise } from "./types";

export const Context = createContext({
  exercises: [] as IdExercise[],
  loadExercises: () => {},
  addExercise: (e: Exercise) => {},
  editExercise: (e: IdExercise) => {},
  removeExercise: (id: number) => {},
});

export default function ExercisesProvider({ children }: any) {
  const [exercises, dispatchExercises] = useReducer(
    (state: any, action: any) => {
      switch (action.type) {
        case "SET_EXERCISES":
          return action.payload;
        case "ADD_EXERCISE":
          return [...state, action.payload];
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

  return (
    <Context.Provider
      value={{
        exercises,
        loadExercises,
        addExercise,
        editExercise,
        removeExercise,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useExercises = () => React.useContext(Context);
