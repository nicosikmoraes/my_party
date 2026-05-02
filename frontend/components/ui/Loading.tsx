// components/ui/Loading.tsx
import { ActivityIndicator, StyleSheet, View } from "react-native";

type LoadingProps = {
  visible?: boolean;
  size?: "small" | "large";
  color?: string;
};

export default function Loading({
  visible = true,
  size = "large",
  color = "black",
}: LoadingProps) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
});
