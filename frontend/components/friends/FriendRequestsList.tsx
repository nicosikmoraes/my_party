import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import TextComponent from '@/components/ui/Text';
import Loading from '@/components/ui/Loading';
import FriendRequestItem from './FriendRequestItem';
import { FriendshipRequest } from '@/types/friendship';
import { getFriendRequests, acceptFriendRequest } from '@/services/friendshipService';
import useToast from '@/hooks/useToast';

const FriendRequestsList: React.FC = () => {
  const [requests, setRequests] = useState<FriendshipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingRequestId, setAcceptingRequestId] = useState<number | null>(null);
  const showToast = useToast();

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getFriendRequests();
      setRequests(response.data);
    } catch (error: any) {
      showToast('error', error.response?.data?.message || 'Erro ao carregar pedidos de amizade.');
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
      showToast('success', 'Pedido de amizade aceito com sucesso!');
      fetchRequests(); // Refresh the list
    } catch (error: any) {
      showToast('error', error.response?.data?.message || 'Erro ao aceitar pedido de amizade.');
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
        <TextComponent message="Nenhum pedido de amizade recebido." opacity={0.7} />
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
    backgroundColor: '#0F0F0F',
    paddingVertical: 10,
  },
});

export default FriendRequestsList;