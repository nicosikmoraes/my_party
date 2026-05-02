import React, { useState } from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import ErrorComponent from "./Error";
import TextComponent from "./Text";

type Props = TextInputProps & {
  borderColor?: string;
  borderError?: string;
  width?: any;
  height?: number;
  borderRadius?: number;
  error?: string;
  label?: string;
  marginBottom?: number;
};

export default function TextAreaComponent({
  borderColor = "#E65C00",
  width = "100%",
  height = 100,
  borderRadius = 6,
  borderError = "transparent",
  error,
  marginBottom = 0,
  label = "",
  ...props
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={{ width, marginBottom }}>
      {label && (
        <View style={{ marginBottom: 5 }}>
          <TextComponent message={label} textAlign="left" />
        </View>
      )}

      <TextInput
        multiline
        textAlignVertical="top"
        style={[
          styles.textarea,
          {
            borderColor: focused ? borderColor : borderError,
            borderWidth: focused ? 2 : 1,
            height,
            borderRadius,
          },
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
  textarea: {
    fontSize: 16,
    padding: 10,
    backgroundColor: "#1A1A1A",
    color: "#B3B3B3",
  },
});
