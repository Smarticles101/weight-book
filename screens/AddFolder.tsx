import React, { useEffect, useLayoutEffect, useMemo } from "react";
import {
  Keyboard,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import {
  TextInput,
  Dialog,
  Appbar,
  HelperText,
  List,
} from "react-native-paper";
import { useFolders } from "../data/foldersProvider";
import functions from "@react-native-firebase/functions";

export default function AddSet({ navigation, route }: any) {
  const [folderName, setFolderName] = React.useState("");

  const [folderNameEmptyErr, setFolderNameEmptyErr] = React.useState(false);
  const [folderNameExistsErr, setFolderNameExistsErr] = React.useState(false);

  const { addFolder, folders } = useFolders();

  const capitalize = (s: string) => {
    if (typeof s !== "string") return "";
    return s
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const close = () => {
    navigation.goBack();
  };

  const submit = () => {
    if (folderName.length > 0) {
      if (!folderNameExistsErr) {
        addFolder({ name: folderName });
        close();
      }
    } else {
      setFolderNameEmptyErr(true);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Appbar.Action icon="content-save" onPress={submit} />,
    });
  }, [navigation, submit]);

  return useMemo(
    () => (
      <KeyboardAvoidingView
        style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
        behavior="padding"
        enabled
        keyboardVerticalOffset={100}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <View style={styles.container}>
              {/* @ts-ignore */}
              <Dialog.Title>Add new folder</Dialog.Title>
              <Dialog.Content style={styles.container}>
                {/* @ts-ignore */}
                <HelperText
                  type="error"
                  visible={folderNameEmptyErr || folderNameExistsErr}
                >
                  {folderNameEmptyErr
                    ? "Folder name is required"
                    : "A folder with this name already exists"}
                </HelperText>
                <TextInput
                  label="Folder name"
                  value={folderName}
                  onChangeText={(folder) => {
                    setFolderNameEmptyErr(folder.length === 0);
                    setFolderNameExistsErr(
                      folders.some(
                        (ex) =>
                          ex.name.trim().toLowerCase() === folder.toLowerCase()
                      )
                    );
                    setFolderName(folder);
                  }}
                  style={styles.textBox}
                  error={folderNameEmptyErr}
                />
              </Dialog.Content>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    ),
    [folderName]
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textBox: {
    marginBottom: 10,
  },
  multilineTextBox: {
    flexGrow: 1,
  },
});
