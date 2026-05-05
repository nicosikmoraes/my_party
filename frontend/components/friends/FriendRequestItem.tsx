import React from "react";
import { View, StyleSheet } from "react-native";
import TextComponent from "@/components/ui/Text";
import PressableComponent from "@/components/ui/Pressable";
import { FriendshipRequest } from "@/types/friendship";
import IconButton from "../ui/PressableIcon";
import { Ionicons } from "@expo/vector-icons";

interface FriendRequestItemProps {
  request: FriendshipRequest;
  onAccept: (friendshipId: number) => void;
  loading?: boolean;
}

const FriendRequestItem: React.FC<FriendRequestItemProps> = ({
  request,
  onAccept,
  loading,
}) => {
  return (
    <View style={styles.container}>
      <TextComponent message={request.sender.name} fontSize={16} />
      <IconButton
        icon={<Ionicons name="checkmark-outline" size={30} color={"#1a1a1a"} />}
        onPress={() => onAccept(request.id)}
        backgroundColor="#E65C00"
        size={36}
        borderRadius={6}
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

export default FriendRequestItem;
