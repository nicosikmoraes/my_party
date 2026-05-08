import { api } from "./api";
import {
  CreateEventPayload,
  UpdateEventPayload,
  Event,
  EventTypeOption,
} from "../types/event";

export const eventService = {
  async getEvents(): Promise<Event[]> {
    const response = await api.get<Event[]>("/events");
    return response.data;
  },

  async getEventById(eventId: number): Promise<Event> {
    const response = await api.get<Event>(`/events/${eventId}`);
    return response.data;
  },

  async createEvent(payload: CreateEventPayload): Promise<Event> {
    const response = await api.post<Event>("/events", payload);
    return response.data;
  },

  async updateEvent(
    eventId: number,
    payload: UpdateEventPayload,
  ): Promise<Event> {
    const response = await api.put<Event>(`/events/${eventId}`, payload);
    return response.data;
  },

  async deleteEvent(eventId: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(
      `/events/${eventId}`,
    );
    return response.data;
  },

  async acceptEvent(eventId: number): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      `/events/${eventId}/accept`,
    );
    return response.data;
  },

  async declineEvent(eventId: number): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      `/events/${eventId}/decline`,
    );
    return response.data;
  },

  async inviteUserToEvent(
    eventId: number,
    userId: number,
  ): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      `/events/${eventId}/invite`,
      { user_id: userId },
    );
    return response.data;
  },

  async getEventTypes(): Promise<EventTypeOption[]> {
    const response = await api.get<EventTypeOption[]>("/events/types");
    return response.data;
  },
};
