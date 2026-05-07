import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { eventService } from "../../services/eventService";
import {
  CreateEventPayload,
  Event,
  EventTypeOption,
  UpdateEventPayload,
} from "../../types/event";
import Loading from "../ui/Loading";
import InputComponent from "../ui/Input";
import SelectModal from "../ui/ModalSelect";
import TextAreaComponent from "../ui/TextArea";
import PressableComponent from "../ui/Pressable";

interface EventFormProps {
  initialValues?: Event;
  onSubmit: (payload: CreateEventPayload | UpdateEventPayload) => void;
  loading?: boolean;
}

function formatInitialDate(date?: string) {
  if (!date) return "";

  const cleanDate = date.includes("T")
    ? date.split("T")[0]
    : date.split(" ")[0];

  const [year, month, day] = cleanDate.split("-");

  if (!year || !month || !day) return "";

  return `${day}/${month}/${year}`;
}

function formatInitialTime(date?: string) {
  if (!date) return "";

  if (date.includes("T")) {
    const time = date.split("T")[1];

    if (!time) return "";

    return time.substring(0, 5);
  }

  if (date.includes(" ")) {
    const time = date.split(" ")[1];

    if (!time) return "";

    return time.substring(0, 5);
  }

  return "";
}

function formatDateInput(value: string) {
  const numbers = value.replace(/\D/g, "").slice(0, 8);

  if (numbers.length <= 2) {
    return numbers;
  }

  if (numbers.length <= 4) {
    return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  }

  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4)}`;
}

function formatTimeInput(value: string) {
  const numbers = value.replace(/\D/g, "").slice(0, 4);

  if (numbers.length <= 2) {
    return numbers;
  }

  return `${numbers.slice(0, 2)}:${numbers.slice(2)}`;
}

function convertDateTimeToApiFormat(date: string, time: string) {
  const [day, month, year] = date.split("/");
  const [hour, minute] = time.split(":");

  return `${year}-${month}-${day} ${hour}:${minute}:00`;
}

function isValidDate(date: string) {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;

  if (!regex.test(date)) return false;

  const [day, month, year] = date.split("/").map(Number);
  const parsedDate = new Date(year, month - 1, day);

  return (
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day
  );
}

function isValidTime(time: string) {
  const regex = /^\d{2}:\d{2}$/;

  if (!regex.test(time)) return false;

  const [hour, minute] = time.split(":").map(Number);

  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}

export const EventForm: React.FC<EventFormProps> = ({
  initialValues,
  onSubmit,
  loading = false,
}) => {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [type, setType] = useState(initialValues?.type ?? "");
  const [date, setDate] = useState(formatInitialDate(initialValues?.date));
  const [time, setTime] = useState(formatInitialTime(initialValues?.date));
  const [address, setAddress] = useState(initialValues?.address ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );

  const [eventTypes, setEventTypes] = useState<EventTypeOption[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchEventTypes() {
      try {
        const types = await eventService.getEventTypes();
        setEventTypes(types);
      } catch (error) {
        console.error("Failed to fetch event types:", error);
      }
    }

    fetchEventTypes();
  }, []);

  function clearFieldError(field: string) {
    setFormErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  }

  function handleDateChange(value: string) {
    setDate(formatDateInput(value));
    clearFieldError("date");
  }

  function handleTimeChange(value: string) {
    setTime(formatTimeInput(value));
    clearFieldError("time");
  }

  function validateForm() {
    const errors: Record<string, string> = {};

    if (!title.trim()) errors.title = "Título é obrigatório.";
    if (!type.trim()) errors.type = "Tipo é obrigatório.";

    if (!date.trim()) {
      errors.date = "Data é obrigatória.";
    } else if (!isValidDate(date)) {
      errors.date = "Data inválida. Use DD/MM/AAAA.";
    }

    if (!time.trim()) {
      errors.time = "Hora é obrigatória.";
    } else if (!isValidTime(time)) {
      errors.time = "Hora inválida. Use HH:MM.";
    }

    if (!address.trim()) errors.address = "Endereço é obrigatório.";

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  }

  function handleSubmit() {
    if (!validateForm()) return;

    const payload: CreateEventPayload | UpdateEventPayload = {
      title: title.trim(),
      type,
      date: convertDateTimeToApiFormat(date, time),
      address: address.trim(),
      description: description.trim() || undefined,
    };

    onSubmit(payload);
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Loading visible={loading} />

      <InputComponent
        label="Event Title"
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          clearFieldError("title");
        }}
        error={formErrors.title}
        borderError={formErrors.title ? "red" : "transparent"}
        marginBottom={15}
        placeholder="Title"
      />

      <View style={styles.selectContainer}>
        <SelectModal
          label="Event Type"
          options={eventTypes}
          value={type}
          onChange={(value) => {
            setType(value);
            clearFieldError("type");
          }}
          placeholder="Select the type"
          error={formErrors.type}
          width="100%"
        />
      </View>

      <View style={styles.dateTimeContainer}>
        <InputComponent
          label="Date"
          value={date}
          onChangeText={handleDateChange}
          error={formErrors.date}
          borderError={formErrors.date ? "red" : "transparent"}
          placeholder="DD/MM/AAAA"
          keyboardType="numeric"
          maxLength={10}
          width="58%"
        />

        <InputComponent
          label="Time"
          value={time}
          onChangeText={handleTimeChange}
          error={formErrors.time}
          borderError={formErrors.time ? "red" : "transparent"}
          placeholder="HH:MM"
          keyboardType="numeric"
          maxLength={5}
          width="38%"
        />
      </View>

      <InputComponent
        label="Address"
        value={address}
        onChangeText={(text) => {
          setAddress(text);
          clearFieldError("address");
        }}
        error={formErrors.address}
        borderError={formErrors.address ? "red" : "transparent"}
        marginBottom={15}
        placeholder="Street 15, 123"
      />

      <TextAreaComponent
        label="Description (Optional)"
        value={description}
        onChangeText={setDescription}
        marginBottom={20}
      />

      <PressableComponent
        message={initialValues ? "Salvar Alterações" : "Criar Evento"}
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
    backgroundColor: "#0F0F0F",
    flexGrow: 1,
  },

  selectContainer: {
    marginBottom: 15,
    width: "100%",
  },

  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
    width: "100%",
  },
});
