import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { AVATAR_PARTS } from "@/constants/avatarItems";
import type { AvatarPart } from "@/types/avatar";
import TextComponent from "../ui/Text";

export type { AvatarPart } from "@/types/avatar";

interface AvatarPartSelectorProps {
  selectedPart: AvatarPart;
  onSelectPart: (part: AvatarPart) => void;
}

export const AvatarPartSelector: React.FC<AvatarPartSelectorProps> = ({
  selectedPart,
  onSelectPart,
}) => {
  return (
    <View style={styles.container}>
      {AVATAR_PARTS.map((part) => (
        <Pressable
          key={part.value}
          style={[
            styles.partButton,
            selectedPart === part.value && styles.selectedPartButton,
          ]}
          onPress={() => onSelectPart(part.value)}
        >
          <TextComponent
            message={part.label}
            color={selectedPart === part.value ? "#F8FAFC" : "#B3B3B3"}
            fontWeight={selectedPart === part.value ? "bold" : "normal"}
          />
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 15,
    width: "100%",
  },
  partButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  selectedPartButton: {
    backgroundColor: "#E65C00",
  },
});
