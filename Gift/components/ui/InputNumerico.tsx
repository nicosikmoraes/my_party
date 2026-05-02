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
  amount?: number;
  currency?: boolean; // 🔥 NOVO
};

export default function InputNumberComponent({
  borderColor = "#E65C00",
  width = "100%",
  height = 45,
  borderRadius = 4,
  borderError = "transparent",
  error,
  marginBottom = 0,
  label = "",
  amount = 2,
  currency = false,
  onChangeText,
  value,
  ...props
}: Props) {
  const [focused, setFocused] = useState(false);

  function formatCurrency(value: string) {
    const number = Number(value) / 100;

    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function handleChange(text: string) {
    let onlyNumbers = text.replace(/[^0-9]/g, "");

    if (!currency) {
      if (onlyNumbers.length > amount) {
        onlyNumbers = onlyNumbers.slice(0, amount);
      }

      onlyNumbers = onlyNumbers.replace(/^0+(\d)/, "$1");

      onChangeText?.(onlyNumbers);
      return;
    }

    const formatted = formatCurrency(onlyNumbers);

    onChangeText?.(formatted);
  }

  return (
    <View style={{ width: width, marginBottom: marginBottom }}>
      {label && (
        <View style={{ marginBottom: 5 }}>
          <TextComponent message={label} textAlign="left" />
        </View>
      )}

      <TextInput
        value={value}
        style={[
          styles.input,
          { borderColor: focused ? borderColor : borderError },
          { borderWidth: focused ? 2 : 1 },
          { width: "100%" },
          { height: height },
          { borderRadius: borderRadius },
        ]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChangeText={handleChange}
        keyboardType="numeric"
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
    backgroundColor: "#1A1A1A",
    color: "#B3B3B3",
  },
});
