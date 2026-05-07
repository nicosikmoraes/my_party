import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import TextComponent from "../ui/Text";
import { Ionicons } from "@expo/vector-icons";

interface EventItemProps {
  title: string;
  type: string;
  date: string;
  address: string;
  onPress: () => void;
}

export const EventItem: React.FC<EventItemProps> = ({
  title,
  type,
  date,
  address,
  onPress,
}) => {
  const formattedDate = new Date(date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <TextComponent
        message={title}
        fontSize={18}
        fontWeight="bold"
        textAlign="left"
      />
      <View style={styles.detailRow}>
        <Ionicons name="calendar" size={16} color="#B3B3B3" />
        <TextComponent
          message={formattedDate}
          color="#B3B3B3"
          textAlign="left"
          marginLeft={5}
        />
      </View>
      <View style={styles.detailRow}>
        <Ionicons name="map" size={16} color="#B3B3B3" />
        <TextComponent
          message={address}
          color="#B3B3B3"
          textAlign="left"
          marginLeft={5}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1A1A1A",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
});
