import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { EventForm } from "../../../components/events/EventForm";
import { eventService } from "../../../services/eventService";
import { CreateEventPayload } from "../../../types/event";
import { router } from "expo-router";
import { showToast } from "../../../utils/toast";
import BlankTemplate from "@/components/template/Blank";
import TitleComponent from "@/components/ui/Title";

const CreateEventScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (payload: CreateEventPayload) => {
    setLoading(true);
    try {
      await eventService.createEvent(payload);
      showToast("Event created successfully", "success");
      router.back();
    } catch (error: any) {
      console.error("Failed to create event:", error);
      const errorMessage =
        error.response?.data?.message || "Error creating event.";
      showToast(errorMessage, "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BlankTemplate>
      <View style={styles.header}>
        <TitleComponent message="Create Event" />
      </View>
      <EventForm onSubmit={handleSubmit} loading={loading} />
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

export default CreateEventScreen;
