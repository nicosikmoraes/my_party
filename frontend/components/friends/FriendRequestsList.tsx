import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import Loading from "@/components/ui/Loading";
import FriendRequestItem from "./FriendRequestItem";
import { FriendshipRequest } from "@/types/friendship";
import {
  getFriendRequests,
  acceptFriendRequest,
} from "@/services/friendshipService";
import { showToast } from "@/utils/toast";
import TitleComponent from "../ui/Title";

const FriendRequestsList: React.FC = () => {
  const [requests, setRequests] = useState<FriendshipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingRequestId, setAcceptingRequestId] = useState<number | null>(
    null,
  );

  const fetchRequests = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getFriendRequests();

      setRequests(data);
    } catch (error: any) {
      console.log("Erro ao carregar pedidos:", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });

      showToast(
        error?.response?.data?.message ||
          "Erro ao carregar pedidos de amizade.",
        "danger",
      );

      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  async function handleAcceptRequest(friendshipId: number) {
    setAcceptingRequestId(friendshipId);

    try {
      await acceptFriendRequest(friendshipId);

      showToast("Invite accepted with success!", "success");

      setRequests((prev) =>
        prev.filter((request) => request.id !== friendshipId),
      );
    } catch (error: any) {
      console.log("Erro ao aceitar pedido:", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });

      showToast(
        error?.response?.data?.message || "Error accepting the invite.",
        "danger",
      );
    } finally {
      setAcceptingRequestId(null);
    }
  }

  const hasRequests = requests.length > 0;

  if (loading) {
    return <Loading visible={true} size="small" color="#E65C00" />;
  }

  if (!hasRequests) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.sectionTitle}>
        <TitleComponent message="Invites" fontSize={18} />
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <FriendRequestItem
            request={item}
            onAccept={handleAcceptRequest}
            loading={acceptingRequestId === item.id}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },

  sectionTitle: {
    marginBottom: 10,
  },
});

export default FriendRequestsList;
