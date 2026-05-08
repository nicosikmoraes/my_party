import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import TextComponent from "../ui/Text";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import TitleComponent from "../ui/Title";
import IconButton from "../ui/PressableIcon";

interface EventItemProps {
  id: number;
  title: string;
  type: string;
  date: string;
  address: string;
  isCreator: boolean;
  onPress: () => void;
  onInvitePress: (eventId: number) => void;
}

export const EventItem: React.FC<EventItemProps> = ({
  id,
  title,
  type,
  date,
  address,
  isCreator,
  onPress,
  onInvitePress,
}) => {
  const formattedDate = new Date(date).toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <TitleComponent message={title} fontSize={18} />
          {isCreator && (
            <MaterialCommunityIcons
              name="crown"
              size={20}
              color="#E65C00"
              style={styles.crownIcon}
            />
          )}
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={14} color="#B3B3B3" />
          <TextComponent
            message={formattedDate}
            color="#B3B3B3"
            fontSize={12}
            opacity={0.8}
            textAlign="left"
            marginLeft={5}
          />
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={14} color="#B3B3B3" />
          <TextComponent
            message={address}
            color="#B3B3B3"
            fontSize={12}
            opacity={0.8}
            textAlign="left"
            marginLeft={5}
          />
        </View>
      </View>
      {isCreator && (
        <IconButton
          icon={<Ionicons name="people-outline" size={24} color="#F8FAFC" />}
          onPress={(event) => {
            event.stopPropagation();
            onInvitePress(id);
          }}
          size={45}
          backgroundColor="#0F0F0F"
          borderRadius={10}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  contentContainer: {
    flex: 1,
    marginRight: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  crownIcon: {
    marginLeft: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
});
