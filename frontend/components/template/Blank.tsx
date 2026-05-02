import React from "react";
import { StyleSheet, View } from "react-native";
import FooterDefault from "./FooterDefault";
import Header from "./Header";
type Props = {
  children: React.ReactNode;
};

export default function BlankTemplate({ children }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />
      </View>

      <View style={{ flex: 1 }}>{children}</View>

      <FooterDefault />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F0F",
  },
  header: {
    padding: 20,
  },
});
