import { Pressable, View, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import TextComponent from "../../components/ui/Text";
import { Friend } from "../../types/friend"; // Certifique-se que o caminho está correto

type FriendItemProps = {
  friend: Friend;
  onNavigate?: () => void;
};

export default function FriendItem({ friend, onNavigate }: FriendItemProps) {
  const iconBgColor = friend.preferred_color;

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        onNavigate?.();
        router.push(`/friends/${friend.id}`);
      }}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
        <Ionicons name="person" size={24} color="#1A1A1A" />
      </View>
      <TextComponent message={friend.name} fontSize={18} fontWeight={900} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
});
