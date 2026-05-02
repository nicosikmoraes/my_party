import { searchUsers } from "@/services/user";
import { showToast } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import InputComponent from "../ui/Input";
import PressableComponent from "../ui/Pressable";
import IconButton from "../ui/PressableIcon";
import TextComponent from "../ui/Text";

type User = {
  id: number;
  name: string;
};

type Props = {
  onAddFriend?: (userId: number) => void;
};

export default function UserSearch({ onAddFriend }: Props) {
  const [found, setFound] = useState(false);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    try {
      setLoading(true);
      const data = await searchUsers(search);
      setUsers(data);
      setFound(true);
    } catch (err) {
      showToast("Error searching users", "danger");
    } finally {
      setLoading(false);
    }
  }

  function handleAdd(userId: number) {
    onAddFriend?.(userId);
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
        <View>
          <IconButton
            icon={<Ionicons name="search" size={30} color={"#1A1A1A"} />}
            backgroundColor="#E65C00"
            borderRadius={6}
            onPress={() => handleSearch()}
          />
        </View>
      </View>

      {users.length === 0 && found ? (
        <TextComponent message="User not found" opacity={0.5} />
      ) : null}

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TextComponent message={item.name} />

            <PressableComponent
              message="Add"
              width={70}
              height={40}
              onPress={() => handleAdd(item.id)}
            />
          </View>
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

  item: {
    backgroundColor: "#1A1A1A",
    padding: 10,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input_container: {
    display: "flex",
    gap: 8,
    flexDirection: "row",
  },
});
