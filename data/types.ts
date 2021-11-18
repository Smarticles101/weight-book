export type Exercise = {
  name: string;
  description: string;
};

// Exercise with an id
export type IdExercise = Exercise & {
  id: number;
};

export type GetExercisesCallback = (exercises: IdExercise[]) => void;
export type InsertExerciseCallback = (exercise: IdExercise) => void;

export type ExerciseSet = {
  reps: number;
  weight: number;
  timestamp: Date;
  notes: string;
};

// ExerciseSet with an id
export type IdExerciseSet = ExerciseSet & {
  id: number;
  exerciseId?: number;
};

export type GetSetsCallback = (sets: IdExerciseSet[]) => void;
export type InsertSetCallback = (set: IdExerciseSet) => void;
export type UpdateSetCallback = (set: IdExerciseSet) => void;
export type DeleteSetCallback = (setId: number) => void;
