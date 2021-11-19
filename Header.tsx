import * as React from "react";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Appbar } from "react-native-paper";

const Header = ({
  navigation,
  route,
  options,
  back,
}: NativeStackHeaderProps) => {
  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : route.name;

  const modal = options.presentation === "modal";

  let actions = null;

  if (options.headerRight) {
    actions = options.headerRight({});
  }

  return (
    <Appbar.Header>
      {back &&
        (modal ? (
          <Appbar.Action icon="close" onPress={navigation.goBack} />
        ) : (
          <Appbar.BackAction onPress={navigation.goBack} />
        ))}
      <Appbar.Content title={title} />
      {actions}
    </Appbar.Header>
  );
};

export default Header;
