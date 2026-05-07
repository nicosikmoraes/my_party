import BlankTemplate from "@/components/template/Blank";
import PressableComponent from "@/components/ui/Pressable";
import TextComponent from "@/components/ui/Text";
import { useAuth } from "@/hooks/useAuth";
import { Event } from "../../types/event";
import { eventService } from "@/services/eventService";
import { useCallback, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import TitleComponent from "@/components/ui/Title";
import IconButton from "@/components/ui/PressableIcon";
import { Ionicons } from "@expo/vector-icons";
import Loading from "@/components/ui/Loading";
import { EventItem } from "@/components/events/EventItem";

export default function Events() {
  const { user, signOut } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const fetchedEvents = await eventService.getEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, []),
  );

  return (
    <BlankTemplate>
      <View style={styles.container}>
        <View style={styles.header}>
          <TitleComponent message="My Events" />
          <IconButton
            icon={<Ionicons name="add-outline" size={24} color="#F8FAFC" />}
            onPress={() => router.push("/events/create")}
          />
        </View>
        <Loading visible={loading} />
        {events.length === 0 && !loading ? (
          <TextComponent message="No event found" opacity={0.6} />
        ) : (
          <FlatList
            data={events}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <EventItem
                title={item.title}
                type={item.type}
                date={item.date}
                address={item.address}
                onPress={() => router.push(`/events/${item.id}`)}
              />
            )}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#F8FAFC"
              />
            }
          />
        )}
      </View>
    </BlankTemplate>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F0F",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
});
