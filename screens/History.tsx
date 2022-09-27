import { useFocusEffect, useScrollToTop } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Appbar, Card, Paragraph } from "react-native-paper";
import { getExerciseHistory } from "../data/database";

export default function History({ navigation, route }: any) {
  const [history, setHistory] = useState([]);
  const listRef = useRef(null);
  useScrollToTop(listRef);

  // i didn't know this existed until today :/
  useFocusEffect(() => {
    getExerciseHistory((history) => {
      let sessions = [];
      let currentSession = [];
      let lastTimestamp = null;
      for (let i = 0; i < history.length; i++) {
        let set = history[i];
        if (lastTimestamp == null) {
          currentSession.push(set);
          lastTimestamp = set.timestamp;
        } else {
          let diff = lastTimestamp - set.timestamp;
          if (diff < 3600000) {
            currentSession.push(set);
          } else {
            sessions.push(currentSession.reverse());
            currentSession = [set];
          }
          lastTimestamp = set.timestamp;
        }
      }
      sessions.push(currentSession.reverse());

      setHistory(sessions);
    });
  });

  const renderItem = ({ item: session }: any) => {
    //console.log(session)
    const date = new Date(session[0].timestamp);

    return (
      <Card style={styles.container}>
        <Card.Title
          title={`${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })}`}
        />
        <Card.Content>
          <Paragraph>
            {session.map((set, i, arr) => {
              let nl = i === 0 ? "" : "\n";
              if (i === 0 || arr[i - 1].name !== arr[i].name) {
                return `${nl}${set.name} ${set.reps}x${set.weight}lbs`;
              } else {
                return `, ${set.reps}x${set.weight}lbs`;
              }
            })}
          </Paragraph>
        </Card.Content>
      </Card>
    );
  };

  return (
    <>
      {/* History has it's own appbar because TabNavigator doesn't support it */}
      <Appbar.Header>
        <Appbar.Content title={route.name} />
      </Appbar.Header>
      <FlatList
        ref={listRef}
        data={history}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </>
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
