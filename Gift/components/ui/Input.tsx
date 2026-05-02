import React, { useState } from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import ErrorComponent from "./Error";
import TextComponent from "./Text";

type Props = TextInputProps & {
  borderColor?: string;
  borderError?: string;
  width?: any;
  height?: any;
  borderRadius?: number;
  error?: string;
  label?: string;
  marginBottom?: number;
  backgroundColor?: string;
};

export default function InputComponent({
  borderColor = "#E65C00",
  width = "100%",
  height = 45,
  borderRadius = 4,
  borderError = "transparent",
  error,
  marginBottom = 0,
  label = "",
  backgroundColor = "#1A1A1A",
  ...props
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={{ width: width, marginBottom: marginBottom }}>
      {label && (
        <View style={{ marginBottom: 5 }}>
          <TextComponent message={label} textAlign="left" />
        </View>
      )}
      <TextInput
        style={[
          styles.input,
          { outlineWidth: 0 },
          { borderColor: focused ? borderColor : borderError },
          { borderWidth: focused ? 2 : 1 },
          { width: "100%" },
          { height: height },
          { borderRadius: borderRadius },
          { backgroundColor: backgroundColor },
        ]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholderTextColor="#B3B3B3"
        selectionColor={borderColor}
        underlineColorAndroid="transparent"
        {...props}
      />

      {error ? <ErrorComponent message={error} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
    padding: 10,
    color: "#B3B3B3",
    zIndex: 2,
  },
});
