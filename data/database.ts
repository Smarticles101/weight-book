import * as SQLite from "expo-sqlite";
import {
  Exercise,
  ExerciseSet,
  GetExercisesCallback,
  GetSetsCallback,
  IdExercise,
  IdExerciseSet,
  InsertExerciseCallback,
  InsertSetCallback,
  UpdateSetCallback,
} from "./types";

import { faker } from "@faker-js/faker";

import analytics from "@react-native-firebase/analytics";

const database_version = 1;

let database = SQLite.openDatabase("weightbook");

// TODO:
// - transpose this logic into a function
// - make async?
// - call in App.tsx, display loading while waiting
// - database update logic at needs to be linear so we don't just have a bunch of callbacks
database.transaction((tx) => {
  tx.executeSql(
    "create table if not exists exercises (id integer primary key not null, name string, description string);"
  );

  tx.executeSql(
    "create table if not exists sets (id integer primary key not null, exerciseId integer not null, reps integer, weight integer, timestamp string, notes string, foreign key(exerciseId) references exercises(id))"
  );

  tx.executeSql(
    `create table if not exists metadata (version integer not null);`,
    [],
    () => {
      tx.executeSql(`select version from metadata;`, [], (tx, results) => {
        if (results.rows.length === 0) {
          tx.executeSql(
            `insert into metadata (version) values (?);`,
            [database_version],
            () => {
              console.log("Database created");
            }
          );
        } else if (results.rows.item(0).version !== database_version) {
          console.log("Database version mismatch");
          // TODO: update database schema
        }
      });
    }
  );
});

export function generateDevData() {
  if (__DEV__) {
    getExercises((exercises) => {
      if (exercises.length === 0) {
        insertExercise({ name: "Squat", description: "Squat" }, ({ id }) => {
          let sets: any[] = [];
          for (let i = 0; i < 400; i++) {
            sets.push({
              reps: faker.datatype.number({ min: 5, max: 20 }),
              weight: faker.datatype.number({ min: 50, max: 100 }),
            });
          }

          sets = sets.sort((b, a) => a.reps * a.weight - b.reps * b.weight);

          faker.date
            .betweens(
              "2020-01-01T00:00:00.000Z",
              "2025-01-01T00:00:00.000Z",
              100
            )
            .forEach((date) => {
              for (let i = 0; i < 4; i++) {
                date.setSeconds(i * 10);
                const { reps, weight } = sets.pop();
                insertSet(
                  id,
                  {
                    reps,
                    weight,
                    timestamp: date,
                    notes: faker.lorem.sentence(),
                  },
                  () => {}
                );
              }
            });
        });
      }
    });
  }
}

export function getExercises(callback: GetExercisesCallback) {
  database.transaction((tx) => {
    // select all exercises joined with most recent set timestamp
    tx.executeSql(
      `select e.id, e.name, e.description, s.timestamp from exercises e left join (select exerciseId, MAX(timestamp) timestamp from sets group by exerciseId) s on e.id = s.exerciseId order by s.timestamp asc;`,
      [],
      (tx, results) => {
        const exercises: IdExercise[] = [];
        for (let i = 0; i < results.rows.length; i++) {
          const row = results.rows.item(i);
          const exercise: IdExercise = {
            id: row.id,
            name: row.name,
            description: row.description,
          };
          if (row.timestamp !== null) {
            exercise.timestamp = new Date(row.timestamp);
          }
          exercises.push(exercise);
        }
        callback(exercises);
      }
    );
  });
}

export function insertExercise(
  { name, description }: Exercise,
  callback: InsertExerciseCallback
) {
  analytics().logEvent("insert_exercise", { name, description });
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

export function updateExercise(
  { id, name, description }: IdExercise,
  callback: InsertExerciseCallback
) {
  analytics().logEvent("update_exercise");
  database.transaction((tx) => {
    tx.executeSql(
      "update exercises set name = ?, description = ? where id = ?",
      [name, description, id],
      (_, {}) => {
        callback({ id, name, description });
      }
    );
  });
}

export function deleteExercise(id: number, callback: Function) {
  analytics().logEvent("delete_exercise");
  database.transaction(
    (tx) => {
      tx.executeSql(`delete from sets where exerciseId = ?;`, [id]);
      tx.executeSql(`delete from exercises where id = ?;`, [id]);
    },
    (error) => {},
    () => {
      callback(id);
    }
  );
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
  { reps, weight, timestamp, notes }: ExerciseSet,
  callback: InsertSetCallback
) {
  analytics().logEvent("insert_set");
  database.transaction((tx) => {
    tx.executeSql(
      "insert into sets (exerciseId, reps, weight, timestamp, notes) values (?, ?, ?, ?, ?)",
      [exerciseId, reps, weight, timestamp.toISOString(), notes],
      (_, { insertId }) => {
        if (insertId) {
          callback({
            id: insertId,
            exerciseId,
            reps,
            weight,
            timestamp,
            notes,
          });
        }
      }
    );
  });
}

export function updateSet(
  { id, reps, weight, notes, timestamp }: IdExerciseSet,
  callback: UpdateSetCallback
) {
  analytics().logEvent("update_set");
  database.transaction((tx) => {
    tx.executeSql(
      "update sets set reps = ?, weight = ?, notes = ?, timestamp = ? where id is (?)",
      [reps, weight, notes, timestamp.valueOf(), id],
      (_, { rows }) => {
        callback({ id, reps, weight, notes, timestamp });
      }
    );
  });
}

export function deleteSet(setId: number, callback: Function) {
  analytics().logEvent("delete_set");
  database.transaction((tx) => {
    tx.executeSql(
      "delete from sets where id is (?)",
      [setId],
      (_, { rows }) => {
        callback(setId);
      }
    );
  });
}
