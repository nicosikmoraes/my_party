// components/ui/Header.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

export default function Header() {
  const canGoBack = router.canGoBack();

  return (
    <>
      {canGoBack && (
        <View style={styles.container}>
          <Pressable onPress={() => router.back()} style={styles.arrow_btn}>
            <Ionicons name="arrow-back" size={24} color="#F8FAFC" />
          </Pressable>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    backgroundColor: "#0F0F0F",
    justifyContent: "center",
    marginTop: 30,
  },

  arrow_btn: {
    backgroundColor: "#1A1A1A",
    width: 40,
    height: 40,
    borderRadius: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
