import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import TextComponent from "@/components/ui/Text";
import type { AvatarItemOption } from "@/types/avatar";
import AvatarHairPreview from "./AvatarHairPreview";

type HairStyleCardSelectorProps = {
  options: AvatarItemOption[];
  value: string;
  onChange: (id: string) => void;
  hairColor?: string;
};

export default function HairStyleCardSelector({
  options,
  value,
  onChange,
  hairColor,
}: HairStyleCardSelectorProps) {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <Pressable
          key={option.id}
          style={[styles.card, value === option.id && styles.selectedCard]}
          onPress={() => onChange(option.id)}
        >
          <AvatarHairPreview
            hairStyle={option.id}
            hairColor={hairColor}
            size={90}
          />
          <TextComponent message={option.label} fontSize={12} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    width: "100%",
  },
  card: {
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderColor: "transparent",
    borderRadius: 10,
    borderWidth: 2,
    gap: 4,
    height: 130,
    justifyContent: "center",
    width: 110,
  },
  selectedCard: {
    borderColor: "#E65C00",
  },
});
