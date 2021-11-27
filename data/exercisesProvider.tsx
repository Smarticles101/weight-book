import * as React from "react";
import { createContext, useReducer } from "react";
import { getExercises, insertExercise } from "./database";
import { Exercise, IdExercise } from "./types";

export const Context = createContext({
  exercises: [] as IdExercise[],
  loadExercises: () => {},
  addExercise: (e: Exercise) => {},
});

export default function ExercisesProvider({ children }: any) {
  const [exercises, dispatchExercises] = useReducer(
    (state: any, action: any) => {
      switch (action.type) {
        case "SET_EXERCISES":
          return action.payload;
        case "ADD_EXERCISE":
          return [...state, action.payload];
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

  return (
    <Context.Provider
      value={{
        exercises,
        loadExercises,
        addExercise,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useExercises = () => React.useContext(Context);
