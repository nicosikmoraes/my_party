// components/ui/Header.tsx
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { StyleSheet, View } from "react-native";
import IconButton from "../ui/PressableIcon";

export default function FooterDefault() {
  const pathname = usePathname();

  const isHome = pathname.startsWith("/home");
  const isEvents = pathname.startsWith("/events");

  return (
    <View style={styles.container}>
      <IconButton
        icon={
          <Ionicons
            name="home"
            size={30}
            color={isHome ? "#E65C00" : "#4C4C4C"}
          />
        }
        onPress={() => router.replace("/(auth)/home")}
        size={30}
      />
      <IconButton
        icon={
          <Ionicons
            name="wine"
            size={30}
            color={isEvents ? "#E65C00" : "#4C4C4C"}
          />
        }
        onPress={() => router.replace("/(auth)/events")}
        size={30}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    height: 100,
    backgroundColor: "#1A1A1A",
    justifyContent: "space-around",
    display: "flex",
    flexDirection: "row",
  },
});
