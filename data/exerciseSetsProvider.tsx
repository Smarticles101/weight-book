import * as React from "react";
import { createContext, useReducer } from "react";
import { deleteSet, getSets, insertSet, updateSet } from "./database";
import { ExerciseSet, IdExerciseSet } from "./types";

export const Context = createContext({
  exerciseSets: [] as IdExerciseSet[],
  addSet: (s: ExerciseSet) => {},
  editSet: (s: IdExerciseSet) => {},
  removeSet: (sId: number) => {},
  useExercise: (eId: number, n: string) => {},
  activeExerciseName: "",
  activeExerciseId: undefined as number | undefined,
});

export default function ExerciseSetsProvider({ children }: any) {
  const [activeExerciseId, setActiveExerciseId] = React.useState<number>();
  const [activeExerciseName, setActiveExerciseName] = React.useState<string>("");
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
    if (activeExerciseId) {
      insertSet(activeExerciseId, set, (set) => {
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
  
  const useExercise = (exerciseId: number, exerciseName: string) => {
    getSets(exerciseId, (sets: any) => {
      setActiveExerciseId(exerciseId);
      setActiveExerciseName(exerciseName);
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
        activeExerciseName,
        activeExerciseId,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useExerciseSets = () => React.useContext(Context);
