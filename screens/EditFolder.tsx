import React, { useEffect, useLayoutEffect, useMemo } from "react";
import {
  Keyboard,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import {
  Appbar,
  Button,
  Dialog,
  HelperText,
  Paragraph,
  Portal,
  TextInput,
} from "react-native-paper";
import { useFolders } from "../data/foldersProvider";

export default function EditFolder({ navigation, route }: any) {
  const [folderName, setFolderName] = React.useState("");

  const [folderNameErr, setFolderNameErr] = React.useState(false);

  const [deleteDialogVisible, setDeleteDialogVisible] = React.useState(false);

  const { folderId, startFolderName } = route.params;

  const { editFolder, removeFolder, activeFolder, useFolder } = useFolders();

  useEffect(() => {
    setFolderName(startFolderName);
  }, []);

  const submit = () => {
    if (folderName.length > 0) {
      editFolder({ id: folderId, name: folderName });
      if (activeFolder.id === folderId) {
        useFolder({ id: folderId, name: folderName });
      }
      setFolderName("");
      navigation.goBack();
    } else {
      setFolderNameErr(true);
    }
  };

  const showDeleteConfirm = () => {
    setDeleteDialogVisible(true);
  };

  const closeDeleteConfirm = () => {
    setDeleteDialogVisible(false);
    deleteSet();
  };

  const deleteSet = () => {
    removeFolder(folderId);
    setFolderName("");
    navigation.navigate("Exercises");
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => [
        <Appbar.Action
          icon="delete"
          onPress={showDeleteConfirm}
          key="del-action"
        />,
        <Appbar.Action
          icon="content-save"
          onPress={submit}
          key="submit-action"
        />,
      ],
    });
  }, [navigation, submit, deleteSet]);

  return useMemo(
    () => (
      <>
        <Portal>
          <Dialog visible={deleteDialogVisible} onDismiss={closeDeleteConfirm}>
            {/* @ts-ignore */}
            <Dialog.Title>Delete folder?</Dialog.Title>
            <Dialog.Content>
              <Paragraph>
                Are you sure you want to delete this folder?
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={closeDeleteConfirm}>Cancel</Button>
              <Button onPress={deleteSet}>Delete</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
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
                <Dialog.Title>Edit exercise</Dialog.Title>
                <Dialog.Content style={styles.container}>
                  {/* @ts-ignore */}
                  <HelperText type="error" visible={folderNameErr}>
                    Folder name is required
                  </HelperText>
                  <TextInput
                    label="Folder name"
                    value={folderName}
                    onChangeText={(folder) => {
                      setFolderNameErr(folder.length === 0);
                      setFolderName(folder);
                    }}
                    style={styles.textBox}
                  />
                </Dialog.Content>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      </>
    ),
    [folderName, deleteDialogVisible]
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textBox: {
    marginBottom: 10,
  },
});
