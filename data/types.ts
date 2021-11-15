export type Exercise = {
    id: number;
    name: string;
    description: string;
};
export type GetExercisesCallback = (exercises: Exercise[]) => void;
export type InsertExerciseCallback = (exercise: Exercise) => void;

export type Set = {
    id: number;
    exerciseId: number; 
    reps: number;
    weight: number;
    timestamp: Date;
}
export type GetSetsCallback = (sets: Set[]) => void;
export type InsertSetCallback = (set: Set) => void;
