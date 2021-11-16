import * as SQLite from "expo-sqlite";
import {
  GetExercisesCallback,
  GetSetsCallback,
  InsertExerciseCallback,
  InsertSetCallback,
} from "./types";

let database = SQLite.openDatabase("weightbook");

database.transaction((tx) => {
  tx.executeSql(
    "create table if not exists exercises (id integer primary key not null, name string, description string);"
  );

  tx.executeSql(
    "create table if not exists sets (id integer primary key not null, exerciseId integer not null, reps integer, weight integer, timestamp string, notes string, foreign key(exerciseId) references exercises(id))"
  );
});

export function getExercises(callback: GetExercisesCallback) {
  database.transaction((tx) => {
    tx.executeSql("select * from exercises", undefined, (_, { rows }) => {
      callback(rows._array);
    });
  });
}

export function insertExercise(
  name: string,
  description: string,
  callback: InsertExerciseCallback
) {
  database.transaction((tx) => {
    tx.executeSql(
      "insert into exercises (name, description) values (?, ?)",
      [name, description],
      (_, { insertId }) => {
        if (insertId) {
          callback({ id: insertId, name, description });
        }
      }
    );
  });
}

export function getSets(exerciseId: number, callback: GetSetsCallback) {
  database.transaction((tx) => {
    tx.executeSql(
      "select * from sets where exerciseId is (?)",
      [exerciseId],
      (_, { rows }) => {
        let sets = rows._array.map((set) => ({
          id: set.id,
          exerciseId: set.exerciseId,
          reps: set.reps,
          weight: set.weight,
          timestamp: new Date(set.timestamp),
          notes: set.notes,
        }));

        callback(sets);
      }
    );
  });
}

export function insertSet(
  exerciseId: number,
  reps: number,
  weight: number,
  timestamp: Date,
  notes: string,
  callback: InsertSetCallback
) {
  database.transaction((tx) => {
    tx.executeSql(
      "insert into sets (exerciseId, reps, weight, timestamp, notes) values (?, ?, ?, ?, ?)",
      [exerciseId, reps, weight, timestamp.toISOString(), notes],
      (_, { insertId }) => {
        if (insertId) {
          callback({ id: insertId, exerciseId, reps, weight, timestamp, notes });
        }
      }
    );
  });
}

export function updateSet(setId: number, reps: number, weight: number, notes: string, callback: Function) {
  database.transaction((tx) => {
    tx.executeSql(
      "update sets set reps = ?, weight = ?, notes = ? where id is (?)",
      [reps, weight, notes, setId],
      (_, { rows }) => {
        callback();
      }
    );
  });
}

export function deleteSet(setId: number, callback: Function) {
  database.transaction((tx) => {
    tx.executeSql("delete from sets where id is (?)", [setId], (_, { rows }) => {
      callback();
    });
  });
}