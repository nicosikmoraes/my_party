import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

type Props = {
  icon: React.ReactNode; // 🔥 recebe qualquer ícone
  size?: number;
  backgroundColor?: string;
  borderRadius?: number;
  marginTop?: number;
  onPress?: () => void;
};

export default function IconButton({
  icon,
  size = 45,
  backgroundColor = "transparent",
  borderRadius = 12,
  marginTop = 0,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.btn,
        {
          width: size,
          height: size,
          borderRadius: borderRadius,
          marginTop: marginTop,
          backgroundColor: backgroundColor,
        },
      ]}
    >
      <View>{icon}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    justifyContent: "center",
    alignItems: "center",
  },
});
