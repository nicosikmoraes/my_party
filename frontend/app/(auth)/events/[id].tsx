import EventParticipantsTab, {
  ParticipantEntry,
} from "@/components/events/EventParticipantsTab";
import Loading from "@/components/ui/Loading";
import BlankTemplate from "@/components/template/Blank";
import TextComponent from "@/components/ui/Text";
import TitleComponent from "@/components/ui/Title";
import IconButton from "@/components/ui/PressableIcon";
import PressableComponent from "@/components/ui/Pressable";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import { eventService } from "../../../services/eventService";
import { getFriends } from "@/services/friendshipService";
import { sendFriendRequest } from "@/services/friendshipService";
import { Event } from "../../../types/event";
import { Friend } from "@/types/friend";
import { showToast } from "../../../utils/toast";
import React, { useState, useCallback, useMemo } from "react";
import { View, StyleSheet, ScrollView, Alert, Pressable } from "react-native";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";

type ActiveTab = "details" | "participants";

const EventDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const eventId = typeof id === "string" ? parseInt(id, 10) : undefined;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [actionLoading, setActionLoading] = useState(false);
  const [isCreator, setIsCreator] = useState(false);

  const [activeTab, setActiveTab] = useState<ActiveTab>("details");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendsLoaded, setFriendsLoaded] = useState(false);

  const friendIds = useMemo(() => new Set(friends.map((f) => f.id)), [friends]);

  const allParticipants = useMemo<ParticipantEntry[]>(() => {
    if (!event) return [];
    const creatorEntry: ParticipantEntry = {
      id: event.creator.id,
      name: event.creator.name,
      isCreator: true,
    };
    const others: ParticipantEntry[] = (event.users || [])
      .filter((u) => u.id !== event.created_by_user_id)
      .map((u) => ({ id: u.id, name: u.name, isCreator: false }));
    return [creatorEntry, ...others];
  }, [event]);

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

  const handleTabChange = useCallback(
    (tab: ActiveTab) => {
      setActiveTab(tab);
      if (tab === "participants" && !friendsLoaded) {
        getFriends()
          .then((data) => setFriends(data))
          .catch(() => {})
          .finally(() => setFriendsLoaded(true));
      }
    },
    [friendsLoaded],
  );

  const handleAddFriend = useCallback(async (userId: number) => {
    try {
      await sendFriendRequest(userId);
      showToast("Friend request sent", "success");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to send friend request.";
      showToast(message, "danger");
      throw error;
    }
  }, []);

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
        <PressableComponent
          message="Go Back"
          onPress={() => router.back()}
          marginTop={20}
        />
      </BlankTemplate>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const formattedTime = new Date(event.date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const invitedUsers = event.users || [];
  const currentUserInvite = invitedUsers.find(
    (participant) => participant.id === user?.id,
  );
  const currentParticipant = event.participants?.find(
    (participant) => participant.user_id === user?.id,
  );
  const currentInviteAccepted =
    currentParticipant?.is_accepted ||
    Boolean(currentUserInvite?.pivot?.is_accepted);
  const canRespondToInvite =
    !isCreator && Boolean(currentUserInvite) && !currentInviteAccepted;

  return (
    <BlankTemplate>
      <View style={styles.tabContent}>
        {activeTab === "details" ? (
          <ScrollView contentContainerStyle={styles.container}>
            <Loading visible={actionLoading} />
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <TitleComponent message={event.title} />
                {isCreator && (
                  <MaterialCommunityIcons
                    name="crown"
                    size={24}
                    color="#E65C00"
                    style={styles.crownIcon}
                  />
                )}
              </View>

              {isCreator && (
                <View style={styles.iconActions}>
                  <IconButton
                    icon={
                      <Ionicons
                        name="pencil-outline"
                        size={24}
                        color="#E65C00"
                      />
                    }
                    onPress={() => router.push(`/events/edit/${event.id}`)}
                    size={45}
                    backgroundColor="#1A1A1A"
                    borderRadius={10}
                  />
                  <IconButton
                    icon={
                      <Ionicons
                        name="trash-outline"
                        size={24}
                        color="#E53935"
                      />
                    }
                    onPress={handleDelete}
                    size={45}
                    backgroundColor="#1A1A1A"
                    borderRadius={10}
                  />
                </View>
              )}
            </View>

            <View style={styles.card}>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={20} color="#F8FAFC" />
                <TextComponent
                  message={formattedDate}
                  fontSize={16}
                  textAlign="left"
                  marginLeft={10}
                />
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={20} color="#F8FAFC" />
                <TextComponent
                  message={formattedTime}
                  fontSize={16}
                  textAlign="left"
                  marginLeft={10}
                />
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={20} color="#F8FAFC" />
                <TextComponent
                  message={event.address}
                  fontSize={16}
                  textAlign="left"
                  marginLeft={10}
                />
              </View>
            </View>

            <View style={styles.card}>
              <TextComponent
                message="Description"
                fontWeight="bold"
                fontSize={16}
                textAlign="left"
              />
              <TextComponent
                message={event.description || "No description provided."}
                color="#B3B3B3"
                textAlign="left"
              />
            </View>

            <View style={styles.card}>
              <TextComponent
                message="Created By"
                fontWeight="bold"
                fontSize={16}
                textAlign="left"
              />
              <TextComponent
                message={event.creator?.name || "Unknown"}
                color="#B3B3B3"
                textAlign="left"
              />
            </View>

            {invitedUsers.length > 0 && (
              <View style={styles.card}>
                <TextComponent
                  message="Participants"
                  fontWeight="bold"
                  fontSize={16}
                  textAlign="left"
                />
                {invitedUsers.map((participantUser) => {
                  const participant = event.participants?.find(
                    (eventParticipant) =>
                      eventParticipant.user_id === participantUser.id,
                  );
                  const accepted =
                    participant?.is_accepted ||
                    Boolean(participantUser.pivot?.is_accepted);

                  return (
                    <View
                      key={participantUser.id}
                      style={styles.participantRow}
                    >
                      <Ionicons
                        name="person-circle-outline"
                        size={20}
                        color="#B3B3B3"
                      />
                      <View style={styles.participantName}>
                        <TextComponent
                          message={participantUser.name || "Unknown User"}
                          color="#B3B3B3"
                          textAlign="left"
                        />
                      </View>
                      <TextComponent
                        message={accepted ? "Accepted" : "Pending"}
                        fontSize={12}
                        color={accepted ? "#4CAF50" : "#E65C00"}
                        textAlign="right"
                      />
                    </View>
                  );
                })}
              </View>
            )}

            {canRespondToInvite && (
              <View style={styles.inviteActions}>
                <PressableComponent
                  message="Accept Invite"
                  onPress={handleAcceptInvite}
                  backgroundColor="#4CAF50"
                  marginTop={10}
                  width="48%"
                />
                <PressableComponent
                  message="Decline Invite"
                  onPress={handleDeclineInvite}
                  backgroundColor="#E53935"
                  marginTop={10}
                  width="48%"
                />
              </View>
            )}

            {isCreator && (
              <View style={styles.creatorActions}>
                <PressableComponent
                  message="Invite Users"
                  onPress={() => router.push(`/events/${event.id}/invite`)}
                  marginTop={10}
                  width="100%"
                  borderRadius={10}
                  padding={0}
                />
              </View>
            )}

            {currentUserInvite && !isCreator && (
              <View style={styles.card}>
                <TextComponent
                  message="Invite Status"
                  fontWeight="bold"
                  fontSize={16}
                  textAlign="left"
                />
                <TextComponent
                  message={currentInviteAccepted ? "Accepted" : "Pending"}
                  color={currentInviteAccepted ? "#4CAF50" : "#E65C00"}
                  textAlign="left"
                />
              </View>
            )}
          </ScrollView>
        ) : (
          <EventParticipantsTab
            participants={allParticipants}
            currentUserId={user!.id}
            friendIds={friendIds}
            onAddFriend={handleAddFriend}
          />
        )}
      </View>

      <View style={styles.tabBar}>
        <Pressable
          style={styles.tabItem}
          onPress={() => handleTabChange("details")}
        >
          <Ionicons
            name="list-outline"
            size={26}
            color={activeTab === "details" ? "#E65C00" : "#4C4C4C"}
          />
        </Pressable>
        <Pressable
          style={styles.tabItem}
          onPress={() => handleTabChange("participants")}
        >
          <Ionicons
            name="people-outline"
            size={26}
            color={activeTab === "participants" ? "#E65C00" : "#4C4C4C"}
          />
        </Pressable>
      </View>
    </BlankTemplate>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
  },
  tabBar: {
    alignItems: "flex-start",
    backgroundColor: "#1A1A1A",
    borderTopColor: "#2A2A2A",
    borderTopWidth: 1,
    flexDirection: "row",
    height: 100,
    paddingTop: 15,
  },
  tabItem: {
    alignItems: "center",
    flex: 1,
    gap: 4,
  },
  container: {
    backgroundColor: "#0F0F0F",
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    width: "100%",
  },
  titleContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 5,
  },
  crownIcon: {
    marginLeft: 10,
  },
  card: {
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    marginBottom: 10,
    padding: 15,
    width: "100%",
  },
  infoRow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 8,
  },
  participantRow: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
  },
  participantName: {
    flex: 1,
    marginLeft: 10,
  },
  inviteActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    width: "100%",
  },
  creatorActions: {
    width: "100%",
  },
  iconActions: {
    flexDirection: "row",
    gap: 5,
  },
});

export default EventDetailScreen;
