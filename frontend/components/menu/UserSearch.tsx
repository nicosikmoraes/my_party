import { searchUsers } from "@/services/user";
import { sendFriendRequest } from "@/services/friendshipService";
import { showToast } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import InputComponent from "../ui/Input";
import IconButton from "../ui/PressableIcon";
import TextComponent from "../ui/Text";
import Loading from "../ui/Loading";
import FriendSearchResultItem from "../friends/FriendSearchResultItem";

type User = {
  id: number;
  name: string;
  email: string;
};

type Props = {
  onAddFriend?: (userId: number) => void;
};

export default function UserSearch({ onAddFriend }: Props) {
  const [found, setFound] = useState(false);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [sendingRequestId, setSendingRequestId] = useState<number | null>(null);

  async function handleSearch() {
    if (!search.trim()) {
      setUsers([]);
      setFound(false);
      return;
    }

    try {
      setSearchLoading(true);

      const data = await searchUsers(search);

      setUsers(data);
      setFound(true);
    } catch (err) {
      showToast("Error searching users", "danger");
      setUsers([]);
      setFound(true);
    } finally {
      setSearchLoading(false);
    }
  }

  async function handleAddFriend(userId: number) {
    try {
      setSendingRequestId(userId);

      if (onAddFriend) {
        onAddFriend(userId);
      } else {
        await sendFriendRequest(userId);
      }

      showToast("Friend request sent", "success");

      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (err: any) {
      showToast(
        err?.response?.data?.message || "Error sending friend request",
        "danger",
      );
    } finally {
      setSendingRequestId(null);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.input_container}>
        <InputComponent
          placeholder="Search"
          value={search}
          onChangeText={setSearch}
          backgroundColor="#0e0e0e"
          width="80%"
        />

        <IconButton
          icon={<Ionicons name="search" size={30} color="#1A1A1A" />}
          backgroundColor="#E65C00"
          borderRadius={6}
          onPress={handleSearch}
        />
      </View>

      {searchLoading ? <Loading visible size="small" color="#E65C00" /> : null}

      {!searchLoading && users.length === 0 && found ? (
        <TextComponent message="User not found" opacity={0.5} />
      ) : null}

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        style={styles.resultsList}
        renderItem={({ item }) => (
          <FriendSearchResultItem
            user={item}
            onAdd={handleAddFriend}
            loading={sendingRequestId === item.id}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginTop: 10,
  },

  input_container: {
    display: "flex",
    gap: 8,
    flexDirection: "row",
  },

  resultsList: {
    maxHeight: 200,
    marginTop: 10,
  },
});
