import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import React from "react";
import { StyleSheet, Text } from "react-native";

type Props = {
  color?: string;
  fontSize?: number;
  fontWeight?: any;
  message: string | undefined;
  opacity?: number;
  textAlign?: any;
  onPress?: () => void;
};

export default function TextComponent({
  color = "#F8FAFC",
  fontSize = 14,
  fontWeight = "regular",
  opacity = 1,
  textAlign = "center",
  message,
  onPress,
}: Props) {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <Text
      onPress={onPress}
      style={[
        styles.text,
        { color: color },
        { fontSize: fontSize },
        { fontWeight: fontWeight },
        { opacity: opacity },
        { textAlign: textAlign },
      ]}
    >
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Roboto_400Regular",
  },
});
