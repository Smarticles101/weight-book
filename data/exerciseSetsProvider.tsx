import * as React from "react";
import { createContext, useReducer } from "react";
import { deleteSet, getSets, insertSet, updateSet } from "./database";
import { ExerciseSet, IdExerciseSet, IdExercise } from "./types";

export const Context = createContext({
  exerciseSets: [] as IdExerciseSet[],
  addSet: (s: ExerciseSet) => {},
  editSet: (s: IdExerciseSet) => {},
  removeSet: (sId: number) => {},
  useExercise: (e: IdExercise) => {},
  activeExercise: {} as IdExercise,
});

export default function ExerciseSetsProvider({ children }: any) {
  const [activeExercise, setActiveExercise] = React.useState<IdExercise>({
    name: "",
    id: 0,
    description: "",
  });
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

export const useExerciseSets = () => React.useContext(Context);
