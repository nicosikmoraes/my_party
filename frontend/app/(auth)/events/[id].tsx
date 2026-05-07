import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import { eventService } from "../../../services/eventService";
import { Event } from "../../../types/event";
import { showToast } from "../../../utils/toast";
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
  const [isCreator, setIsCreator] = useState(false);

  const fetchEventDetails = async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      const fetchedEvent = await eventService.getEventById(eventId);
      setEvent(fetchedEvent);
      setIsCreator(fetchedEvent.created_by_user_id === user?.id);
    } catch (error: any) {
      console.error("Failed to fetch event details:", error);
      const errorMessage =
        error.response?.data?.message || "Error loading event details.";
      showToast(errorMessage, "danger");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEventDetails();
    }, [eventId, user?.id]),
  );

  const handleDelete = () => {
    Alert.alert(
      "Confirm deletion",
      "Are you sure you want to delete this event? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setActionLoading(true);
            try {
              await eventService.deleteEvent(eventId!);
              showToast("Event deleted successfully", "success");
              router.back();
            } catch (error: any) {
              console.error("Failed to delete event:", error);
              const errorMessage =
                error.response?.data?.message || "Error deleting event.";
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
      showToast("Invite accepted", "success");
      fetchEventDetails();
    } catch (error: any) {
      console.error("Failed to accept invite:", error);
      const errorMessage =
        error.response?.data?.message || "Error accepting invite.";
      showToast(errorMessage, "danger");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeclineInvite = async () => {
    setActionLoading(true);
    try {
      await eventService.declineEvent(eventId!);
      showToast("Invite declined", "success");
      router.back();
    } catch (error: any) {
      console.error("Failed to decline invite:", error);
      const errorMessage =
        error.response?.data?.message || "Error declining invite.";
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
        <TextComponent message="Event not found." />
      </BlankTemplate>
    );
  }

  const formattedDate = new Date(event.date).toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const confirmedParticipants = event.users.filter((eventUser) => {
    const participant = event.participants?.find(
      (eventParticipant) =>
        eventParticipant.user_id === eventUser.id && eventParticipant.is_accepted,
    );

    return Boolean(participant || eventUser.pivot?.is_accepted);
  });

  return (
    <BlankTemplate>
      <ScrollView contentContainerStyle={styles.container}>
        <Loading visible={actionLoading} />
        <View style={styles.header}>
          <TitleComponent message={event.title} />
          {isCreator && (
            <View style={styles.actionButtons}>
              <TextComponent message="Edit" />
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
          <TextComponent message="Type:" fontWeight="bold" textAlign="left" />
          <TextComponent message={event.type} textAlign="left" />
        </View>
        <View style={styles.detailRow}>
          <TextComponent message="Date:" fontWeight="bold" textAlign="left" />
          <TextComponent message={formattedDate} textAlign="left" />
        </View>
        <View style={styles.detailRow}>
          <TextComponent
            message="Address:"
            fontWeight="bold"
            textAlign="left"
          />
          <TextComponent message={event.address} textAlign="left" />
        </View>
        {event.description && (
          <View style={styles.detailRow}>
            <TextComponent
              message="Description:"
              fontWeight="bold"
              textAlign="left"
            />
            <TextComponent message={event.description} textAlign="left" />
          </View>
        )}
        <View style={styles.detailRow}>
          <TextComponent
            message="Creator:"
            fontWeight="bold"
            textAlign="left"
          />
          <TextComponent message={event.creator.name} textAlign="left" />
        </View>

        <TextComponent
          message="Confirmed participants:"
          fontWeight="bold"
          textAlign="left"
        />
        {confirmedParticipants.length > 0 ? (
          confirmedParticipants.map((user) => (
            <TextComponent
              key={user.id}
              message={`- ${user.name}`}
              textAlign="left"
            />
          ))
        ) : (
          <TextComponent
            message="No confirmed participants yet."
            textAlign="left"
          />
        )}

        {!isCreator &&
          user &&
          event.users?.some((participant) => participant.id === user.id) && (
            <View style={styles.inviteActions}>
              <PressableComponent
                message="Accept Invite"
                onPress={handleAcceptInvite}
                backgroundColor="#4CAF50"
                marginTop={20}
                width="48%"
              />

              <PressableComponent
                message="Decline Invite"
                onPress={handleDeclineInvite}
                backgroundColor="#E53935"
                marginTop={20}
                width="48%"
              />
            </View>
          )}

        {isCreator && (
          <PressableComponent
            message="Invite users"
            onPress={() => router.push(`/events/${event.id}/invite`)}
            marginTop={20}
            width="100%"
            borderRadius={10}
          />
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
