import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TitleComponent } from '../../../components/ui/Title';
import { BlankTemplate } from '../../../templates/BlankTemplate'; // Assuming BlankTemplate exists
import { EventForm } from '../../../components/events/EventForm';
import { eventService } from '../../../services/eventService';
import { CreateEventPayload } from '../../../types/event';
import { router } from 'expo-router';
import { showToast } from '../../../utils/toast'; // Assuming toast utility exists

const CreateEventScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (payload: CreateEventPayload) => {
    setLoading(true);
    try {
      await eventService.createEvent(payload);
      showToast('success', 'Sucesso', 'Evento criado com sucesso!');
      router.back(); // Or router.push('/events') if there's a specific list route
    } catch (error: any) {
      console.error('Failed to create event:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao criar evento.';
      showToast('error', 'Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BlankTemplate>
      <View style={styles.header}>
        <TitleComponent message="Criar Evento" />
      </View>
      <EventForm onSubmit={handleSubmit} loading={loading} />
    </BlankTemplate>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
});

export default CreateEventScreen;