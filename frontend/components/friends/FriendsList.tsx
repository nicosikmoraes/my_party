import React, { useEffect, useState } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { TextComponent } from "../ui/Text";
import { Loading } from "../ui/Loading";
import { FriendItem } from "./FriendItem";
import { getFriends } from "../../services/friendshipService";
import { Friend } from "../../types/friendship";
import { showToast } from "../../utils/toast"; // Assumindo que showToast é importado de utils/toast

export const FriendsList: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const data = await getFriends();
        setFriends(data);
      } catch (error) {
        showToast("Falha ao carregar amigos.", "danger");
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading visible={true} size="large" />
      </View>
    );
  }

  if (friends.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <TextComponent message="Nenhum amigo ainda." opacity={0.7} />
      </View>
    );
  }

  return (
    <FlatList
      data={friends}
      renderItem={({ item }) => <FriendItem friend={item} />}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 100, // Ajuste a altura conforme necessário
  },
  emptyContainer: {
    padding: 16,
    alignItems: "center",
  },
  listContent: {
    paddingBottom: 20, // Garante que o último item não seja cortado
  },
});