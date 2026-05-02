import React from "react";
import { StyleSheet, View } from "react-native";
import Header from "./Header";

type Props = {
  children: React.ReactNode;
};

export default function CenteredTemplate({ children }: Props) {
  return (
    <View style={[styles.container, { width: "100%" }]}>
      <Header />
      <View style={styles.container_children}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0F0F0F",
  },
  container_children: {
    gap: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
});
