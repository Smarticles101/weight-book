import * as React from "react";
import { createContext, useReducer } from "react";
import {
  deleteExerciseFolder,
  deleteFolder,
  getFolders,
  insertExerciseFolder,
  insertFolder,
  updateFolder,
} from "./database";
import { Folder, IdFolder, ExerciseFolder, IdExerciseFolder } from "./types";

export const Context = createContext({
  folders: [] as IdFolder[],
  loadFolders: () => {},
  addFolder: (f: Folder) => {},
  editFolder: (f: IdFolder) => {},
  removeFolder: (id: number) => {},
  folderExercises: [] as IdExerciseFolder[],
  addExerciseToFolder: (e: ExerciseFolder) => {},
  removeExerciseFromFolder: (eId: number) => {},
  useFolder: (f: IdFolder) => {},
  activeFolder: {} as IdFolder,
});

export default function FoldersProvider({ children }: any) {
  const [folders, dispatchFolders] = useReducer(
    (state: IdFolder[], action: any) => {
      switch (action.type) {
        case "SET_FOLDERS":
          return action.payload;
        case "ADD_FOLDER":
          return [...state, action.payload].sort((a, b) =>
            a.name < b.name ? -1 : 1
          );
        case "EDIT_FOLDER":
          return state.map((folder: IdFolder) => {
            if (folder.id === action.payload.id) {
              return {
                ...folder,
                ...action.payload,
              };
            }
            return folder;
          });
        case "REMOVE_FOLDER":
          return state.filter(
            (folder: IdFolder) => folder.id !== action.payload.id
          );
      }
    },
    []
  );

  const loadFolders = async () => {
    getFolders((folders) =>
      dispatchFolders({ type: "SET_FOLDERS", payload: folders })
    );
  };

  const addFolder = async (folder: Folder) => {
    insertFolder(folder, (newFolder) =>
      dispatchFolders({ type: "ADD_FOLDER", payload: newFolder })
    );
  };

  const editFolder = async (folder: IdFolder) => {
    updateFolder(folder, () =>
      dispatchFolders({ type: "EDIT_FOLDER", payload: folder })
    );
  };

  const removeFolder = async (folderId: number) => {
    deleteFolder(folderId, () =>
      dispatchFolders({ type: "REMOVE_FOLDER", payload: { id: folderId } })
    );
  };

  const [folderExercises, dispatchFolderExercises] = useReducer(
    (state: IdExerciseFolder[], action: any) => {
      switch (action.type) {
        case "SET_EXERCISES":
          return action.payload;
        case "ADD_EXERCISE_TO_FOLDER":
          return [...state, action.payload];
        case "REMOVE_EXERCISE_FROM_FOLDER":
          return state.filter(
            (exerciseFolder: IdExerciseFolder) =>
              exerciseFolder.id !== action.payload.id
          );
      }
    },
    []
  );

  const addExerciseToFolder = (exerciseFolder: ExerciseFolder) => {
    insertExerciseFolder(exerciseFolder, (newExerciseFolder) =>
      dispatchFolderExercises({
        type: "ADD_EXERCISE_TO_FOLDER",
        payload: newExerciseFolder,
      })
    );
  };

  const removeExerciseFromFolder = (exerciseFolderId: number) => {
    deleteExerciseFolder(exerciseFolderId, () =>
      dispatchFolderExercises({
        type: "REMOVE_EXERCISE_FROM_FOLDER",
        payload: { id: exerciseFolderId },
      })
    );
  };

  const [activeFolder, setActiveFolder] = React.useState({} as IdFolder);

  return (
    <Context.Provider
      value={{
        folders,
        loadFolders,
        addFolder,
        editFolder,
        removeFolder,
        folderExercises,
        addExerciseToFolder,
        removeExerciseFromFolder,
        useFolder: setActiveFolder,
        activeFolder,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useFolders = () => React.useContext(Context);
