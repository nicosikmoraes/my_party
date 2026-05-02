import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import TextComponent from "@/components/ui/Text";
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
  const [requests, setRequests] = useState<FriendshipRequest[] | any>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingRequestId, setAcceptingRequestId] = useState<number | null>(
    null,
  );

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getFriendRequests();
      setRequests(response.data);
    } catch (error: any) {
      showToast(
        "error",
        error.response?.data?.message || "Erro ao carregar pedidos de amizade.",
      );
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleAcceptRequest = async (friendshipId: number) => {
    setAcceptingRequestId(friendshipId);
    try {
      await acceptFriendRequest(friendshipId);
      showToast("Invite accepeted with success!", "success");
      fetchRequests(); // Refresh the list
    } catch (error: any) {
      showToast(
        "error",
        error.response?.data?.message || "Error accepting the invite.",
      );
    } finally {
      setAcceptingRequestId(null);
    }
  };

  if (loading) {
    return <Loading visible={true} size="small" color="#E65C00" />;
  }

  return (
    <View style={styles.container}>
      {requests.length === 0 ? (
        <></>
      ) : (
        <View style={styles.sectionTitle}>
          <TitleComponent message="Invites" fontSize={18} />
        </View>
      )}

      {requests.length === 0 ? (
        <></>
      ) : (
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
  },
  sectionTitle: {
    marginBottom: 10,
  },
});

export default FriendRequestsList;
