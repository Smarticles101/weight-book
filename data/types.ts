export type Exercise = {
  name: string;
  description: string;
};

// Exercise with an id
export type IdExercise = Exercise & {
  id: number;
  timestamp?: Date;
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

export type Folder = {
  name: string;
};

export type IdFolder = Folder & {
  id: number;
};

export type GetFoldersCallback = (folders: IdFolder[]) => void;
export type InsertFolderCallback = (folder: IdFolder) => void;
export type UpdateFolderCallback = (folder: IdFolder) => void;
export type DeleteFolderCallback = (folderId: number) => void;

export type ExerciseFolder = {
  exerciseId: number;
  folderId: number;
};

export type IdExerciseFolder = ExerciseFolder & {
  id: number;
};

export type DeleteExerciseFolderCallback = (id: number) => void;
export type InsertExerciseFolderCallback = (
  exerciseFolder: IdExerciseFolder
) => void;
