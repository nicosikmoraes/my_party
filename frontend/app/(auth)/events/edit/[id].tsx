import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { EventForm } from "../../../../components/events/EventForm";
import { eventService } from "../../../../services/eventService";
import { UpdateEventPayload, Event } from "../../../../types/event";
import { router, useLocalSearchParams } from "expo-router";
import { showToast } from "../../../../utils/toast";
import Loading from "@/components/ui/Loading";
import BlankTemplate from "@/components/template/Blank";
import TextComponent from "@/components/ui/Text";
import TitleComponent from "@/components/ui/Title";

const EditEventScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const eventId = typeof id === "string" ? parseInt(id, 10) : undefined;
  const [event, setEvent] = useState<Event | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      setLoadingInitial(true);
      try {
        const fetchedEvent = await eventService.getEventById(eventId);
        setEvent(fetchedEvent);
      } catch (error: any) {
        console.error("Failed to fetch event for edit:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Error loading event for editing.";
        showToast(errorMessage, "danger");
        router.back();
      } finally {
        setLoadingInitial(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleSubmit = async (payload: UpdateEventPayload) => {
    if (!eventId) return;
    setLoadingSubmit(true);
    try {
      await eventService.updateEvent(eventId, payload);
      showToast("Event updated successfully", "success");
      router.back(); // Or navigate to event details
    } catch (error: any) {
      console.error("Failed to update event:", error);
      const errorMessage =
        error.response?.data?.message || "Error updating event.";
      showToast(errorMessage, "danger");
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingInitial) {
    return <Loading visible={true} />;
  }

  if (!event) {
    return (
      <BlankTemplate>
        <TextComponent message="Event not found for editing." />
      </BlankTemplate>
    );
  }

  return (
    <BlankTemplate>
      <View style={styles.header}>
        <TitleComponent message="Edit Event" />
      </View>
      <EventForm
        initialValues={event}
        onSubmit={handleSubmit}
        loading={loadingSubmit}
      />
    </BlankTemplate>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
});

export default EditEventScreen;
