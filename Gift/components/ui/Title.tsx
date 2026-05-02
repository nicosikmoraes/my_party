import {
  JuliusSansOne_400Regular,
  useFonts,
} from "@expo-google-fonts/julius-sans-one";
import React from "react";
import { StyleSheet, Text } from "react-native";

type Props = {
  fontSize?: number;
  message: string;
};

export default function TitleComponent({ fontSize = 20, message }: Props) {
  const [fontsLoaded] = useFonts({
    JuliusSansOne_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return <Text style={[styles.title, { fontSize: fontSize }]}>{message}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "JuliusSansOne_400Regular",
    color: "#F8FAFC",
  },
});
