import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import BlankTemplate from "@/components/template/Blank";
import TitleComponent from "@/components/ui/Title";
import InputComponent from "@/components/ui/Input";
import PressableComponent from "@/components/ui/Pressable";
import TextComponent from "@/components/ui/Text";
import Loading from "@/components/ui/Loading";
import { showToast } from "@/utils/toast";
import { getFriends } from "@/services/friendshipService";
import { searchUsers } from "@/services/user";
import { eventService } from "@/services/eventService";
import { InviteUser, InviteUserItem } from "@/components/events/InviteUserItem";
import { useAuth } from "@/hooks/useAuth";

const InviteUsersToEventScreen: React.FC = () => {
  const { id: eventIdParam } = useLocalSearchParams();
  const eventId = typeof eventIdParam === "string" ? Number(eventIdParam) : undefined;
  const { user: currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<InviteUser[]>([]);
  const [friends, setFriends] = useState<InviteUser[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [invitingUserId, setInvitingUserId] = useState<number | null>(null);
  const [invitedUserIds, setInvitedUserIds] = useState<Set<number>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchFriends = useCallback(async () => {
    if (!currentUser) return;
    try {
      const friendsData = await getFriends();
      setFriends(friendsData);
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || "Error fetching friends",
        "danger",
      );
    } finally {
      setInitialLoading(false);
      setRefreshing(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const handleSearchUsers = async () => {
    if (!searchQuery.trim()) {
      showToast("Please enter a name to search", "danger");
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    setHasSearched(true);
    try {
      const users = await searchUsers(searchQuery.trim());
      setSearchResults(users.filter((u: InviteUser) => u.id !== currentUser?.id));
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || "Error searching users",
        "danger",
      );
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleInviteUser = async (userId: number) => {
    if (!eventId || !currentUser) return;
    if (userId === currentUser.id) {
      showToast("You cannot invite yourself to the event", "danger");
      return;
    }
    setInvitingUserId(userId);
    try {
      await eventService.inviteUserToEvent(eventId, userId);
      setInvitedUserIds((prev) => new Set(prev).add(userId));
      showToast("User invited successfully", "success");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Error inviting user";
      showToast(errorMessage, "danger");
    } finally {
      setInvitingUserId(null);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFriends();
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
  };

  if (initialLoading) {
    return <Loading visible={true} />;
  }

  const renderUser = (item: InviteUser) => (
    <InviteUserItem
      user={item}
      onInvite={handleInviteUser}
      loading={invitingUserId === item.id}
      invited={invitedUserIds.has(item.id)}
    />
  );

  return (
    <BlankTemplate>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#F8FAFC"
          />
        }
      >
        <TitleComponent message="Invite Users" />

        <View style={styles.searchContainer}>
          <InputComponent
            placeholder="Search by name"
            value={searchQuery}
            onChangeText={setSearchQuery}
            width="70%"
          />
          <PressableComponent
            message="Search"
            onPress={handleSearchUsers}
            loading={searchLoading}
            width="28%"
            height={45}
            borderRadius={8}
          />
        </View>

        {hasSearched && (
          <View style={styles.section}>
            <TextComponent
              message="Search Results"
              fontSize={18}
              fontWeight="bold"
              textAlign="left"
            />
            <View style={styles.list}>
              {searchResults.length > 0 ? (
                searchResults.map((item) => (
                  <View key={item.id}>{renderUser(item)}</View>
                ))
              ) : (
                <TextComponent
                  message="No users found"
                  color="#B3B3B3"
                  textAlign="left"
                />
              )}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <TextComponent
            message="Friends"
            fontSize={18}
            fontWeight="bold"
            textAlign="left"
          />
          <View style={styles.list}>
            {friends.filter((friend) => friend.id !== currentUser?.id).length > 0 ? (
              friends
                .filter((friend) => friend.id !== currentUser?.id)
                .map((item) => <View key={item.id}>{renderUser(item)}</View>)
            ) : (
              <TextComponent
                message="No friends found"
                color="#B3B3B3"
                textAlign="left"
              />
            )}
          </View>
        </View>
      </ScrollView>
      <Loading visible={searchLoading} />
    </BlankTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
    width: "100%",
  },
  section: {
    width: "100%",
    marginBottom: 20,
  },
  list: {
    marginTop: 10,
  },
});

export default InviteUsersToEventScreen;
