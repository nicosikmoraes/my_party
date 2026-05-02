import { getGiftStyle } from "@/utils/giftStyle";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import IconButton from "../ui/PressableIcon";
import TextComponent from "../ui/Text";

type Props = {
  gift: {
    id: number;
    name: string;
    price?: number;
    type: string;
  };
  onPress?: () => void;
};

export default function GiftItem({ gift, onPress }: Props) {
  const { icon, color } = getGiftStyle(gift.type);

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={[styles.icon_container, { backgroundColor: color }]}>
        <IconButton
          icon={<Ionicons name={icon} size={45} color="#1A1A1A" />}
          size={45}
        />
      </View>

      <TextComponent message={gift.name} fontSize={16} fontWeight="heavy" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 7,
    backgroundColor: "#1A1A1A",
    borderRadius: 4,
    marginBottom: 10,
    height: 80,
    display: "flex",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  icon_container: {
    height: 65,
    width: 65,
    borderRadius: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
