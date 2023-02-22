import React, { useEffect, useMemo } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { FAB, List, Paragraph, Searchbar } from "react-native-paper";
import { useFolders } from "../data/foldersProvider";

export default function Folders({ navigation }: any) {
  const showDialog = () => {
    navigation.push("Add Folder");
  };

  const { loadFolders, folders, useFolder } = useFolders();

  const [searchQuery, setSearchQuery] = React.useState("");

  useEffect(() => {
    loadFolders();
  }, []);

  return useMemo(
    () => (
      <KeyboardAvoidingView
        behavior="padding"
        enabled
        keyboardVerticalOffset={100}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <>
            <Searchbar
              placeholder="Search"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <FlatList
              data={folders.filter((e) =>
                e.name.toLowerCase().includes(searchQuery.toLowerCase())
              )}
              renderItem={({ item }) => (
                <List.Item
                  title={item.name}
                  onPress={() => {
                    useFolder(item);
                    // TODO: navigate to exercises
                    navigation.push("Exercise List", {
                      defaultName: item.name,
                      defaultId: item.id,
                    });
                  }}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
            />

            {folders.length === 0 && (
              <View style={{ flex: 1, alignItems: "center" }}>
                <Paragraph>
                  Click the plus to create your first folder!
                </Paragraph>
              </View>
            )}

            <FAB style={styles.fab} icon="plus" onPress={showDialog} />
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    ),
    [folders, searchQuery]
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 8,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
