import React from "react";
import { View, StyleSheet } from "react-native";
import { User } from "@/types/user";
import TextComponent from "@/components/ui/Text";
import PressableComponent from "@/components/ui/Pressable";

interface FriendSearchResultItemProps {
  user: User;
  onAdd: (userId: number) => void;
  loading?: boolean;
}

const FriendSearchResultItem: React.FC<FriendSearchResultItemProps> = ({
  user,
  onAdd,
  loading,
}) => {
  return (
    <View style={styles.container}>
      <TextComponent message={user.name} fontSize={16} />
      <PressableComponent
        message="Add"
        onPress={() => onAdd(user.id)}
        loading={loading}
        width={70}
        height={35}
        padding={0}
        borderRadius={6}
        backgroundColor="#E65C00"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
});

export default FriendSearchResultItem;
