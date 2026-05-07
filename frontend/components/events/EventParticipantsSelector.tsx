import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { getFriends } from "../../services/friendshipService";
import { UserBasic } from "../../types/event";
import TextComponent from "../ui/Text";
import { Ionicons } from "@expo/vector-icons";

interface Friend {
  id: number;
  name: string;
}

interface EventParticipantsSelectorProps {
  onParticipantsChange: (participantIds: number[]) => void;
  initialSelectedParticipants?: number[];
}

export const EventParticipantsSelector: React.FC<
  EventParticipantsSelectorProps
> = ({ onParticipantsChange, initialSelectedParticipants = [] }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>(
    initialSelectedParticipants,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const allFriends = await getFriends();
        const acceptedFriends = allFriends
          .filter(
            (friend: any) =>
              friend.status === "accepted" &&
              friend.user_id !== friend.friend_id,
          )
          .map((friend: any) => ({
            id: friend.friend.id,
            name: friend.friend.name,
          }));
        setFriends(acceptedFriends);
      } catch (error) {
        console.error("Failed to fetch friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const toggleParticipant = (friendId: number) => {
    const newSelectedParticipants = selectedParticipants.includes(friendId)
      ? selectedParticipants.filter((id) => id !== friendId)
      : [...selectedParticipants, friendId];
    setSelectedParticipants(newSelectedParticipants);
    onParticipantsChange(newSelectedParticipants);
  };

  if (loading) {
    return <TextComponent message="Carregando amigos..." />;
  }

  if (friends.length === 0) {
    return <TextComponent message="No Friend" />;
  }

  return (
    <View style={styles.container}>
      <TextComponent
        message="Convide amigos:"
        fontWeight="bold"
        textAlign="left"
      />
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.friendItem,
              selectedParticipants.includes(item.id) &&
                styles.selectedFriendItem,
            ]}
            onPress={() => toggleParticipant(item.id)}
          >
            <TextComponent
              message={item.name}
              color={
                selectedParticipants.includes(item.id) ? "#F8FAFC" : "#B3B3B3"
              }
              textAlign="left"
            />
            {selectedParticipants.includes(item.id) && (
              <Ionicons name="checkmark-outline" size={20} color="#E65C00" />
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: "100%",
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#1A1A1A",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#1A1A1A",
  },
  selectedFriendItem: {
    borderColor: "#E65C00",
  },
});
