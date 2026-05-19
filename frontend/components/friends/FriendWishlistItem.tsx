import TextComponent from "@/components/ui/Text";
import { FriendProfileGift } from "@/types/user";
import { getGiftStyle } from "@/utils/giftStyle";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  UIManager,
  View,
} from "react-native";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface FriendWishlistItemProps {
  gift: FriendProfileGift;
  isExpanded: boolean;
  onPress: () => void;
}

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined | null;
}) => (
  <View style={styles.detailRow}>
    <TextComponent message={`${label}:`} color="#B3B3B3" textAlign="left" />
    <View style={styles.detailValue}>
      <TextComponent
        message={
          value === null || value === undefined || value === ""
            ? "-"
            : String(value)
        }
        textAlign="right"
      />
    </View>
  </View>
);

export function FriendWishlistItem({
  gift,
  isExpanded,
  onPress,
}: FriendWishlistItemProps) {
  const { icon, color } = getGiftStyle(gift.type || "other");

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onPress();
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handlePress} style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <Ionicons name={icon} size={40} color="#1A1A1A" />
        </View>
        <View style={styles.headerContent}>
          <TextComponent
            message={gift.name}
            fontSize={16}
            fontWeight="heavy"
            textAlign="left"
          />
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={22}
          color={isExpanded ? "#E65C00" : "#F8FAFC"}
        />
      </Pressable>

      {isExpanded && (
        <View style={styles.detailsContainer}>
          <View style={styles.separator} />
          <DetailRow label="Type" value={gift.type} />
          <DetailRow label="Price" value={gift.price} />
          <DetailRow label="Quantity" value={gift.quantity} />
          <DetailRow label="Color" value={gift.color} />
          <DetailRow label="Description" value={gift.description} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#333",
    borderRadius: 8,
    marginBottom: 4,
    padding: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    height: 56,
    width: 56,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
  },
  detailsContainer: {
    marginTop: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#E65C00",
    opacity: 0.35,
    marginVertical: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 4,
    gap: 12,
  },
  detailValue: {
    flex: 1,
  },
});
