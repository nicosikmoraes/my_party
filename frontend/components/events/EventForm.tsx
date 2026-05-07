import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { InputComponent } from '../ui/Input';
import { SelectModal } from '../ui/SelectModal';
import { TextAreaComponent } from '../ui/TextArea';
import { PressableComponent } from '../ui/Pressable';
import { TextComponent } from '../ui/Text';
import { Loading } from '../ui/Loading';
import { eventService } from '../../services/eventService';
import { EventTypeOption, CreateEventPayload, UpdateEventPayload, Event } from '../../types/event';
import { EventParticipantsSelector } from './EventParticipantsSelector';

interface EventFormProps {
  initialValues?: Event;
  onSubmit: (payload: CreateEventPayload | UpdateEventPayload) => void;
  loading?: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({ initialValues, onSubmit, loading }) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [type, setType] = useState(initialValues?.type || '');
  const [date, setDate] = useState(initialValues?.date.split('T')[0] + ' ' + initialValues?.date.split('T')[1].substring(0, 8) || ''); // YYYY-MM-DD HH:MM:SS format
  const [address, setAddress] = useState(initialValues?.address || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>(
    initialValues?.users.filter(u => u.id !== initialValues.created_by_user_id).map(u => u.id) || []
  );
  const [eventTypes, setEventTypes] = useState<EventTypeOption[]>([]);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const types = await eventService.getEventTypes();
        setEventTypes(types);
      } catch (error) {
        console.error('Failed to fetch event types:', error);
      }
    };
    fetchEventTypes();
  }, []);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!title) errors.title = 'Título é obrigatório.';
    if (!type) errors.type = 'Tipo é obrigatório.';
    if (!date) errors.date = 'Data e Hora são obrigatórios.';
    if (!address) errors.address = 'Endereço é obrigatório.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const payload: CreateEventPayload | UpdateEventPayload = {
        title,
        type,
        date,
        address,
        description: description || undefined,
        ...(initialValues ? {} : { participants: selectedParticipants }), // Only send participants on create
      };
      onSubmit(payload);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Loading visible={loading} />
      <InputComponent
        label="Título do Evento"
        value={title}
        onChangeText={setTitle}
        error={formErrors.title}
        marginBottom={15}
      />
      <SelectModal
        label="Tipo de Evento"
        options={eventTypes}
        value={type}
        onChange={setType}
        placeholder="Selecione o tipo"
        error={formErrors.type}
        marginBottom={15}
      />
      <InputComponent
        label="Data e Hora (AAAA-MM-DD HH:MM:SS)"
        value={date}
        onChangeText={setDate}
        error={formErrors.date}
        marginBottom={15}
        placeholder="Ex: 2024-12-31 19:00:00"
      />
      <InputComponent
        label="Endereço"
        value={address}
        onChangeText={setAddress}
        error={formErrors.address}
        marginBottom={15}
      />
      <TextAreaComponent
        label="Descrição (Opcional)"
        value={description}
        onChangeText={setDescription}
        marginBottom={20}
      />
      {!initialValues && ( // Only show participant selector on create
        <EventParticipantsSelector
          onParticipantsChange={setSelectedParticipants}
          initialSelectedParticipants={selectedParticipants}
        />
      )}
      <PressableComponent
        message={initialValues ? 'Salvar Alterações' : 'Criar Evento'}
        onPress={handleSubmit}
        loading={loading}
        width="100%"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#0F0F0F',
    flexGrow: 1,
  },
});