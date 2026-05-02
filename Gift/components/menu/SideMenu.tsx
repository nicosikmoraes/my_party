import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import TextComponent from "../ui/Text";
import TitleComponent from "../ui/Title";
import UserSearch from "./UserSearch";

const SCREEN_WIDTH = Dimensions.get("window").width;

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function SideMenu({ visible, onClose }: Props) {
  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  const [isMounted, setIsMounted] = useState(visible);

  const MENU_WIDTH = SCREEN_WIDTH * 0.7;

  const overlayOpacity = translateX.interpolate({
    inputRange: [0, MENU_WIDTH],
    outputRange: [0.7, 0],
    extrapolate: "clamp",
  });

  useEffect(() => {
    if (visible) {
      setIsMounted(true);

      Animated.timing(translateX, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateX, {
        toValue: SCREEN_WIDTH,
        duration: 250,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        setIsMounted(false);
      });
    }
  }, [visible]);

  if (!isMounted) return null;

  return (
    <Modal transparent animationType="none">
      <View style={styles.container}>
        <Animated.View
          pointerEvents={visible ? "auto" : "none"}
          style={[
            styles.overlay,
            {
              opacity: overlayOpacity,
            },
          ]}
        >
          <Pressable style={{ flex: 1 }} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[
            styles.menu,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <View style={styles.header}>
            <TitleComponent message="Friends" fontSize={18} />
            <Ionicons
              name="close"
              size={24}
              color="#e00b0b"
              onPress={onClose}
            />
          </View>

          <View style={styles.content}>
            <UserSearch />

            <TextComponent
              message="No friends yet"
              fontWeight={300}
              fontSize={14}
              opacity={0.6}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },

  overlay: {
    flex: 1,
  },

  menu: {
    width: "70%",
    height: "100%",
    backgroundColor: "#1A1A1A",
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  content: {
    flex: 1,
  },
});
