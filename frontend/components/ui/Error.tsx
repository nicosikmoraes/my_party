import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import React from "react";
import { StyleSheet, Text } from "react-native";

type Props = {
  message: string;
};

export default function ErrorComponent({ message }: Props) {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  if (!fontsLoaded) return null;

  return <Text style={[styles.text]}>{message}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Roboto_400Regular",
    marginTop: 6,
    fontSize: 14,
    color: "red",
  },
});
