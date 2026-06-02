import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import TextComponent from "../ui/Text";

type ColorOption = {
  hex: string;
  label: string;
};

const defaultColorOptions: ColorOption[] = [
  { hex: "#F2C6A0", label: "Light skin" },
  { hex: "#D9A066", label: "Medium skin" },
  { hex: "#8D5524", label: "Dark skin" },
  { hex: "#FFDBAC", label: "Pale skin" },
  { hex: "#2B1A10", label: "Brown hair" },
  { hex: "#000000", label: "Black" },
  { hex: "#6B4423", label: "Dark brown" },
  { hex: "#D6B370", label: "Blonde" },
  { hex: "#E65C00", label: "Orange" },
  { hex: "#2563EB", label: "Blue" },
  { hex: "#16A34A", label: "Green" },
  { hex: "#DC2626", label: "Red" },
  { hex: "#9333EA", label: "Purple" },
  { hex: "#F8FAFC", label: "White" },
  { hex: "#111827", label: "Dark gray" },
  { hex: "#333333", label: "Gray" },
  { hex: "#1E3A8A", label: "Dark blue" },
  { hex: "#4B5563", label: "Light gray" },
  { hex: "#111111", label: "Black shoes" },
  { hex: "#7C2D12", label: "Brown" },
  { hex: "#1F2937", label: "Slate" },
];

type AvatarColorSelectorProps = {
  label: string;
  colors?: ColorOption[];
  selectedColor?: string | null;
  onSelectColor?: (hex: string) => void;
  onChange?: (hex: string) => void;
};

const AvatarColorSelector: React.FC<AvatarColorSelectorProps> = ({
  label,
  colors = defaultColorOptions,
  selectedColor,
  onSelectColor,
  onChange,
}) => {
  const handleSelectColor = onChange || onSelectColor;

  return (
    <View style={styles.container}>
      <TextComponent
        message={label}
        color="#F8FAFC"
        fontSize={16}
        fontWeight="bold"
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.colorOptionsContainer}
      >
        {colors.map((color) => (
          <Pressable
            key={color.hex}
            disabled={!handleSelectColor}
            onPress={() => handleSelectColor?.(color.hex)}
            style={[
              styles.colorSwatch,
              { backgroundColor: color.hex },
              selectedColor === color.hex && styles.selectedColorSwatch,
            ]}
            accessibilityLabel={`Select ${label} ${color.label}`}
          >
            {selectedColor === color.hex ? (
              <View
                style={[
                  styles.selectedDot,
                  {
                    backgroundColor: isLightColor(color.hex)
                      ? "#111111"
                      : "#FFFFFF",
                  },
                ]}
              />
            ) : null}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    paddingVertical: 14,
    width: "100%",
  },
  colorOptionsContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    paddingHorizontal: 16,
  },
  colorSwatch: {
    alignItems: "center",
    borderColor: "transparent",
    borderRadius: 22,
    borderWidth: 2,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  selectedColorSwatch: {
    borderColor: "#E65C00",
    borderWidth: 4,
  },
  selectedDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
});

export default AvatarColorSelector;

const isLightColor = (hex: string) => {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 155;
};
