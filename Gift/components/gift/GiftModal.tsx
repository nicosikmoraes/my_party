import { markAsPurchased } from "@/services/gift";
import { formatCurrency } from "@/utils/format";
import { getGiftStyle } from "@/utils/giftStyle";
import { showToast } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { Modal, StyleSheet, View } from "react-native";
import PressableComponent from "../ui/Pressable";
import IconButton from "../ui/PressableIcon";
import TextComponent from "../ui/Text";
import TitleComponent from "../ui/Title";

type Gift = {
  id: number;
  name: string;
  type: string;
  price?: number;
  description?: string;
  color?: string;
  quantity: number;
};

type Props = {
  visible: boolean;
  gift: Gift | null;
  onClose: () => void;
};

export default function GiftModal({ visible, gift, onClose }: Props) {
  const { icon, color } = getGiftStyle(gift?.type);

  async function handleMarkAsBought() {
    if (!gift) return;

    try {
      await markAsPurchased(gift.id);

      showToast("Gift marked as purchased", "success");

      onClose();
    } catch (error) {
      showToast("Error updating gift", "danger");
    }
  }
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {gift && (
            <>
              <View style={styles.titulo_container}>
                <View
                  style={[styles.icon_container, { backgroundColor: color }]}
                >
                  <IconButton
                    icon={<Ionicons name={icon} size={45} color="#1A1A1A" />}
                    size={45}
                  />
                </View>

                <View style={styles.titulo_detalhe}>
                  <TitleComponent
                    message={`${gift.name} - ${gift.type}`}
                    fontSize={16}
                  />
                </View>

                <View style={styles.times}>
                  <IconButton
                    icon={<Ionicons name="close" size={20} color="#BF0000" />}
                    onPress={onClose}
                    size={20}
                  />
                </View>
              </View>

              <View style={styles.info_container}>
                {gift.description && (
                  <TextComponent
                    message={gift.description}
                    textAlign="left"
                    color="#9A9A9A"
                  />
                )}
                {gift.price && (
                  <TextComponent
                    message={`Estimate price: ${formatCurrency(gift.price)}`}
                  />
                )}
                {gift.quantity > 1 && (
                  <TextComponent message={`Quantity: ${gift.quantity}`} />
                )}
                {gift.color && (
                  <TextComponent message={`Color: ${gift.color ?? "-"}`} />
                )}
              </View>

              <PressableComponent
                message="Set as bought"
                onPress={handleMarkAsBought}
                marginTop={20}
              />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    width: "90%",
    backgroundColor: "#1A1A1A",
    padding: 20,
    borderRadius: 10,
    gap: 10,
  },
  icon_container: {
    height: 65,
    width: 65,
    borderRadius: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  titulo_container: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  titulo_detalhe: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    width: 180,
  },
  info_container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  times: {
    marginLeft: "auto",
  },
});
