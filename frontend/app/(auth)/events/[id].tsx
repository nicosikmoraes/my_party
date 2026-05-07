import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import { eventService } from "../../../services/eventService";
import { Event } from "../../../types/event";
import { showToast } from "../../../utils/toast"; // Assuming toast utility exists
import Loading from "@/components/ui/Loading";
import BlankTemplate from "@/components/template/Blank";
import TextComponent from "@/components/ui/Text";
import TitleComponent from "@/components/ui/Title";
import IconButton from "@/components/ui/PressableIcon";
import PressableComponent from "@/components/ui/Pressable";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";

const EventDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const eventId = typeof id === "string" ? parseInt(id, 10) : undefined;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [actionLoading, setActionLoading] = useState(false);
  const [isCreator, setIsCreator] = useState(false); // This would need to be checked against authenticated user ID

  const fetchEventDetails = async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      const fetchedEvent = await eventService.getEventById(eventId);
      setEvent(fetchedEvent);
      setIsCreator(fetchedEvent.creator.id === 1);
    } catch (error: any) {
      console.error("Failed to fetch event details:", error);
      const errorMessage =
        error.response?.data?.message || "Erro ao carregar detalhes do evento.";
      showToast(errorMessage, "danger");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEventDetails();
    }, [eventId]),
  );

  const handleDelete = () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este evento? Esta ação é irreversível.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            setActionLoading(true);
            try {
              await eventService.deleteEvent(eventId!);
              showToast("Evento excluído com sucesso!", "success");
              router.back();
            } catch (error: any) {
              console.error("Failed to delete event:", error);
              const errorMessage =
                error.response?.data?.message || "Erro ao excluir evento.";
              showToast(errorMessage, "danger");
            } finally {
              setActionLoading(false);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleAcceptInvite = async () => {
    setActionLoading(true);
    try {
      await eventService.acceptEvent(eventId!);
      showToast("Convite aceito!", "danger");
      fetchEventDetails();
    } catch (error: any) {
      console.error("Failed to accept invite:", error);
      const errorMessage =
        error.response?.data?.message || "Erro ao aceitar convite.";
      showToast(errorMessage, "danger");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeclineInvite = async () => {
    setActionLoading(true);
    try {
      await eventService.declineEvent(eventId!);
      showToast("Convite recusado!", "success");
      router.back(); // Or refresh and show no longer participating
    } catch (error: any) {
      console.error("Failed to decline invite:", error);
      const errorMessage =
        error.response?.data?.message || "Erro ao recusar convite.";
      showToast(errorMessage, "danger");
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

  const formattedDate = new Date(event.date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <BlankTemplate>
      <ScrollView contentContainerStyle={styles.container}>
        <Loading visible={actionLoading} />
        <View style={styles.header}>
          <TitleComponent message={event.title} />
          {isCreator && (
            <View style={styles.actionButtons}>
              <TextComponent message="Edir" />
              <IconButton
                icon={
                  <Ionicons name="pencil-outline" size={24} color="#E65C00" />
                }
                onPress={() => router.push(`/events/edit/${event.id}`)}
              />
              <IconButton
                icon={<Ionicons name="trash" size={24} color="red" />}
                onPress={handleDelete}
              />
            </View>
          )}
        </View>

        <View style={styles.detailRow}>
          <TextComponent message="Tipo:" fontWeight="bold" textAlign="left" />
          <TextComponent message={event.type} textAlign="left" />
        </View>
        <View style={styles.detailRow}>
          <TextComponent message="Data:" fontWeight="bold" textAlign="left" />
          <TextComponent message={formattedDate} textAlign="left" />
        </View>
        <View style={styles.detailRow}>
          <TextComponent
            message="Endereço:"
            fontWeight="bold"
            textAlign="left"
          />
          <TextComponent message={event.address} textAlign="left" />
        </View>
        {event.description && (
          <View style={styles.detailRow}>
            <TextComponent
              message="Descrição:"
              fontWeight="bold"
              textAlign="left"
            />
            <TextComponent message={event.description} textAlign="left" />
          </View>
        )}
        <View style={styles.detailRow}>
          <TextComponent
            message="Criador:"
            fontWeight="bold"
            textAlign="left"
          />
          <TextComponent message={event.creator.name} textAlign="left" />
        </View>

        <TextComponent
          message="Participantes Confirmados:"
          fontWeight="bold"
          textAlign="left"
        />
        {event.users.filter((u) =>
          event.participants.find((p) => p.user_id === u.id && p.is_accepted),
        ).length > 0 ? (
          event.users
            .filter((u) =>
              event.participants.find(
                (p) => p.user_id === u.id && p.is_accepted,
              ),
            )
            .map((user) => (
              <TextComponent
                key={user.id}
                message={`- ${user.name}`}
                textAlign="left"
              />
            ))
        ) : (
          <TextComponent
            message="Nenhum participante confirmado ainda."
            textAlign="left"
          />
        )}

        {!isCreator &&
          user &&
          event.users?.some((participant) => participant.id === user.id) && (
            <View style={styles.inviteActions}>
              <PressableComponent
                message="Aceitar Convite"
                onPress={handleAcceptInvite}
                backgroundColor="#4CAF50"
                marginTop={20}
                width="48%"
              />

              <PressableComponent
                message="Recusar Convite"
                onPress={handleDeclineInvite}
                backgroundColor="#E53935"
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
    backgroundColor: "#0F0F0F",
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  inviteActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
});

export default EventDetailScreen;
