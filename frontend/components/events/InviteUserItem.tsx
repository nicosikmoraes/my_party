import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TextComponent from "../ui/Text";
import PressableComponent from "../ui/Pressable";

export type InviteUser = {
  id: number;
  name: string;
  email?: string;
};

interface InviteUserItemProps {
  user: InviteUser;
  onInvite: (userId: number) => void;
  loading: boolean;
  invited: boolean;
}

export const InviteUserItem: React.FC<InviteUserItemProps> = ({
  user,
  onInvite,
  loading,
  invited,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Ionicons name="person-circle-outline" size={32} color="#F8FAFC" />
        <View style={styles.textContainer}>
          <TextComponent message={user.name} fontSize={16} />
          {user.email && (
            <TextComponent message={user.email} color="#B3B3B3" fontSize={12} />
          )}
        </View>
      </View>
      <PressableComponent
        message={invited ? "Invited" : "Invite"}
        onPress={() => {
          if (!invited && !loading) {
            onInvite(user.id);
          }
        }}
        loading={loading}
        width={80}
        height={35}
        borderRadius={8}
        backgroundColor={invited ? "#333" : "#E65C00"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
  },
});
