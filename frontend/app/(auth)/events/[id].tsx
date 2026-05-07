import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { TitleComponent } from '../../../components/ui/Title';
import { TextComponent } from '../../../components/ui/Text';
import { BlankTemplate } from '../../../templates/BlankTemplate';
import { Loading } from '../../../components/ui/Loading';
import { PressableComponent } from '../../../components/ui/Pressable';
import { IconButton } from '../../../components/ui/IconButton';
import { Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react-native';
import { eventService } from '../../../services/eventService';
import { Event } from '../../../types/event';
import { showToast } from '../../../utils/toast'; // Assuming toast utility exists

const EventDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const eventId = typeof id === 'string' ? parseInt(id, 10) : undefined;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isCreator, setIsCreator] = useState(false); // This would need to be checked against authenticated user ID

  const fetchEventDetails = async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      const fetchedEvent = await eventService.getEventById(eventId);
      setEvent(fetchedEvent);
      // Assume local storage or context for authenticated user ID
      // For now, let's mock it or assume a check will be done backend
      // In a real app, you'd check `fetchedEvent.created_by_user_id === authUserId`
      setIsCreator(fetchedEvent.creator.id === 1); // Mocking creator check, replace with actual user ID
    } catch (error: any) {
      console.error('Failed to fetch event details:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao carregar detalhes do evento.';
      showToast('error', 'Erro', errorMessage);
      router.back();
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEventDetails();
    }, [eventId])
  );

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este evento? Esta ação é irreversível.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setActionLoading(true);
            try {
              await eventService.deleteEvent(eventId!);
              showToast('success', 'Sucesso', 'Evento excluído com sucesso!');
              router.back();
            } catch (error: any) {
              console.error('Failed to delete event:', error);
              const errorMessage = error.response?.data?.message || 'Erro ao excluir evento.';
              showToast('error', 'Erro', errorMessage);
            } finally {
              setActionLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleAcceptInvite = async () => {
    setActionLoading(true);
    try {
      await eventService.acceptEvent(eventId!);
      showToast('success', 'Sucesso', 'Convite aceito!');
      fetchEventDetails(); // Refresh event details
    } catch (error: any) {
      console.error('Failed to accept invite:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao aceitar convite.';
      showToast('error', 'Erro', errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeclineInvite = async () => {
    setActionLoading(true);
    try {
      await eventService.declineEvent(eventId!);
      showToast('success', 'Sucesso', 'Convite recusado!');
      router.back(); // Or refresh and show no longer participating
    } catch (error: any) {
      console.error('Failed to decline invite:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao recusar convite.';
      showToast('error', 'Erro', errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <Loading visible={true} />;
  }

  if (!event) {
    return (
      <BlankTemplate>
        <TextComponent message="Evento não encontrado." />
      </BlankTemplate>
    );
  }

  const formattedDate = new Date(event.date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <BlankTemplate>
      <ScrollView contentContainerStyle={styles.container}>
        <Loading visible={actionLoading} />
        <View style={styles.header}>
          <TitleComponent message={event.title} />
          {isCreator && (
            <View style={styles.actionButtons}>
              <IconButton
                icon={<Edit size={24} color="#E65C00" />}
                onPress={() => router.push(`/events/edit/${event.id}`)}
              />
              <IconButton
                icon={<Trash2 size={24} color="red" />}
                onPress={handleDelete}
              />
            </View>
          )}
        </View>

        <View style={styles.detailRow}>
          <TextComponent message="Tipo:" fontWeight="bold" textAlign="left" />
          <TextComponent message={event.type} textAlign="left" marginLeft={5} />
        </View>
        <View style={styles.detailRow}>
          <TextComponent message="Data:" fontWeight="bold" textAlign="left" />
          <TextComponent message={formattedDate} textAlign="left" marginLeft={5} />
        </View>
        <View style={styles.detailRow}>
          <TextComponent message="Endereço:" fontWeight="bold" textAlign="left" />
          <TextComponent message={event.address} textAlign="left" marginLeft={5} />
        </View>
        {event.description && (
          <View style={styles.detailRow}>
            <TextComponent message="Descrição:" fontWeight="bold" textAlign="left" />
            <TextComponent message={event.description} textAlign="left" marginLeft={5} />
          </View>
        )}
        <View style={styles.detailRow}>
          <TextComponent message="Criador:" fontWeight="bold" textAlign="left" />
          <TextComponent message={event.creator.name} textAlign="left" marginLeft={5} />
        </View>

        <TextComponent message="Participantes Confirmados:" fontWeight="bold" textAlign="left" marginTop={20} marginBottom={10} />
        {event.users.filter(u => event.participants.find(p => p.user_id === u.id && p.is_accepted)).length > 0 ? (
          event.users
            .filter(u => event.participants.find(p => p.user_id === u.id && p.is_accepted))
            .map((user) => (
              <TextComponent key={user.id} message={`- ${user.name}`} textAlign="left" marginBottom={5} />
            ))
        ) : (
          <TextComponent message="Nenhum participante confirmado ainda." textAlign="left" />
        )}

        {/* Action buttons for participants who are not the creator */}
        {!isCreator && event.participants.some(p => p.user_id === 1 && !p.is_accepted) && ( // Mocking current user ID
          <View style={styles.inviteActions}>
            <PressableComponent
              message="Aceitar Convite"
              onPress={handleAcceptInvite}
              loading={actionLoading}
              backgroundColor="#4CAF50"
              marginTop={20}
              width="48%"
            />
            <PressableComponent
              message="Recusar Convite"
              onPress={handleDeclineInvite}
              loading={actionLoading}
              backgroundColor="#F44336"
              marginTop={20}
              width="48%"
            />
          </View>
        )}
      </ScrollView>
    </BlankTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#0F0F0F',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inviteActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default EventDetailScreen;