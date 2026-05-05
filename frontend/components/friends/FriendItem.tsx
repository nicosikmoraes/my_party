import React from "react";
import { View, StyleSheet } from "react-native";
import { Friend } from "../../types/friend";
import TextComponent from "../ui/Text";

type FriendItemProps = {
  friend: Friend;
};

export const FriendItem: React.FC<FriendItemProps> = ({ friend }) => {
  return (
    <View style={styles.container}>
      <TextComponent message={friend.name} fontSize={16} />
      {friend.email && (
        <TextComponent message={friend.email} fontSize={14} opacity={0.7} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
});
