import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Loading from "@/components/ui/Loading";

type Avatar3DProps = {
  avatarUrl?: string | null;
  size?: number;
  backgroundColor?: string;
};

const DEFAULT_PARTS = {
  skin: "#E8B29A",
  shirt: "#E65C00",
  pants: "#243044",
  shoe: "#101820",
};

export default function Avatar3D({
  avatarUrl,
  size = 220,
  backgroundColor = "#0F0F0F",
}: Avatar3DProps) {
  const [loading, setLoading] = useState(true);
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadingTimeout = setTimeout(() => setLoading(false), 150);
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(rotation, {
          toValue: 1,
          duration: 2400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: 0,
          duration: 2400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      clearTimeout(loadingTimeout);
      animation.stop();
    };
  }, [rotation, avatarUrl]);

  const rotateY = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["-12deg", "12deg"],
  });

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, backgroundColor },
      ]}
    >
      <Animated.View
        style={[
          styles.avatar,
          {
            transform: [{ perspective: 700 }, { rotateY }],
          },
        ]}
      >
        <View style={[styles.head, { backgroundColor: DEFAULT_PARTS.skin }]}>
          <View style={styles.eyeRow}>
            <View style={styles.eye} />
            <View style={styles.eye} />
          </View>
        </View>
        <View style={styles.bodyRow}>
          <View style={[styles.arm, { backgroundColor: DEFAULT_PARTS.skin }]} />
          <View style={[styles.torso, { backgroundColor: DEFAULT_PARTS.shirt }]} />
          <View style={[styles.arm, { backgroundColor: DEFAULT_PARTS.skin }]} />
        </View>
        <View style={styles.legsRow}>
          <View style={[styles.leg, { backgroundColor: DEFAULT_PARTS.pants }]} />
          <View style={[styles.leg, { backgroundColor: DEFAULT_PARTS.pants }]} />
        </View>
        <View style={styles.feetRow}>
          <View style={[styles.foot, { backgroundColor: DEFAULT_PARTS.shoe }]} />
          <View style={[styles.foot, { backgroundColor: DEFAULT_PARTS.shoe }]} />
        </View>
      </Animated.View>

      <Loading visible={loading} color="#E65C00" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: 8,
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  avatar: {
    alignItems: "center",
    height: "86%",
    justifyContent: "center",
    width: "70%",
  },
  head: {
    alignItems: "center",
    borderRadius: 42,
    elevation: 4,
    height: 68,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.25,
    shadowRadius: 9,
    width: 68,
  },
  eyeRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 8,
  },
  eye: {
    backgroundColor: "#101820",
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  bodyRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 8,
    marginTop: -2,
  },
  arm: {
    borderRadius: 16,
    height: 78,
    marginTop: 8,
    width: 18,
  },
  torso: {
    borderRadius: 20,
    height: 88,
    width: 70,
  },
  legsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: -2,
  },
  leg: {
    borderRadius: 14,
    height: 58,
    width: 24,
  },
  feetRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: -2,
  },
  foot: {
    borderRadius: 10,
    height: 14,
    width: 30,
  },
});
