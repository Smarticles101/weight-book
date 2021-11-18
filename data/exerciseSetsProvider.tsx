import * as React from "react";
import { createContext, useReducer } from "react";
import { deleteSet, getSets, insertSet, updateSet } from "./database";
import { ExerciseSet, IdExerciseSet } from "./types";

export const Context = createContext({
  exerciseSets: [] as IdExerciseSet[],
  addSet: (s: ExerciseSet) => {},
  editSet: (s: IdExerciseSet) => {},
  removeSet: (sId: number) => {},
  useExercise: (eId: number) => {},
});

export default function ExerciseSetsProvider({ children }: any) {
  
  const [exerciseId, setExerciseId] = React.useState<number>();
  const [sets, dispatchSets] = useReducer((state: any, action: any) => {
    switch (action.type) {
      case "SET_SETS":
        return action.payload;
      case "ADD_SET":
        return [...state, action.payload];
      case "EDIT_SET":
        return state.map((set: any) => {
          if (set.id === action.payload.id) {
            return {
              ...set,
              ...action.payload,
            };
          }
          return set;
        });
      case "REMOVE_SET":
        return state.filter((set: any) => set.id !== action.payload);
      default:
        return state;
    }
  }, []);

  const addSet = (set: ExerciseSet) => {
    if (exerciseId) {
      insertSet(exerciseId, set, (set) => {
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
  
  const useExercise = (exerciseId: number) => {
    getSets(exerciseId, (sets: any) => {
      setExerciseId(exerciseId);
      dispatchSets({ type: "SET_SETS", payload: sets });
    });
  };

  return (
    <Context.Provider
      value={{
        exerciseSets: sets,
        addSet,
        editSet,
        removeSet,
        useExercise,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useExerciseSets = () => React.useContext(Context);
