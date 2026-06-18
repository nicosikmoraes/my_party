import Avatar3D from "@/components/avatar/Avatar3D";
import PressableComponent from "@/components/ui/Pressable";
import TextComponent from "@/components/ui/Text";
import TitleComponent from "@/components/ui/Title";
import { AVATAR_DEFAULT_CUSTOMIZATION } from "@/constants/avatarItems";
import { getUserProfile } from "@/services/user";
import { AvatarCustomization } from "@/types/avatar";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

export type ParticipantEntry = {
  id: number;
  name: string;
  isCreator: boolean;
};

type Props = {
  participants: ParticipantEntry[];
  currentUserId: number;
  friendIds: Set<number>;
  onAddFriend: (userId: number) => Promise<void>;
};

export default function EventParticipantsTab({
  participants,
  currentUserId,
  friendIds,
  onAddFriend,
}: Props) {
  const initialIndex = Math.max(
    0,
    participants.findIndex((p) => p.id === currentUserId),
  );

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [cache, setCache] = useState<Record<number, AvatarCustomization>>({});
  const [addingFriend, setAddingFriend] = useState(false);
  const [sentRequests, setSentRequests] = useState<Set<number>>(new Set());
  const pendingLoads = useRef(new Set<number>());

  const participant = participants[currentIndex];
  const customization = participant ? (cache[participant.id] ?? null) : null;
  const isCurrentUser = participant?.id === currentUserId;
  const isFriend = participant ? friendIds.has(participant.id) : false;
  const hasSent = participant ? sentRequests.has(participant.id) : false;
  const showAddFriend = !isCurrentUser && !isFriend && !hasSent;

  useEffect(() => {
    if (!participant) return;
    const userId = participant.id;
    if (cache[userId] !== undefined || pendingLoads.current.has(userId)) return;

    pendingLoads.current.add(userId);
    getUserProfile(userId)
      .then((profile) => {
        const c = profile.user.avatar_customization;
        setCache((prev) => ({
          ...prev,
          [userId]: {
            ...AVATAR_DEFAULT_CUSTOMIZATION,
            ...(c ?? {}),
          } as AvatarCustomization,
        }));
      })
      .catch(() => {
        setCache((prev) => ({
          ...prev,
          [userId]: AVATAR_DEFAULT_CUSTOMIZATION as AvatarCustomization,
        }));
      })
      .finally(() => {
        pendingLoads.current.delete(userId);
      });
  }, [participant?.id]);

  const goTo = (delta: number) => {
    setCurrentIndex(
      (prev) => (prev + delta + participants.length) % participants.length,
    );
  };

  const handleAddFriend = async () => {
    if (!participant) return;
    setAddingFriend(true);
    try {
      await onAddFriend(participant.id);
      setSentRequests((prev) => new Set([...prev, participant.id]));
    } finally {
      setAddingFriend(false);
    }
  };

  if (participants.length === 0) {
    return (
      <View style={styles.empty}>
        <TextComponent message="No participants yet." color="#B3B3B3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TitleComponent message="PARTICIPANTS" fontSize={20} />
      <View style={styles.carouselWrapper}>
        {customization === null ? (
          <View style={styles.avatarLoading}>
            <ActivityIndicator size="large" color="#E65C00" />
          </View>
        ) : (
          <Avatar3D
            size={240}
            skinColor={
              customization.skin_color ??
              AVATAR_DEFAULT_CUSTOMIZATION.skin_color
            }
            hairColor={
              customization.hair_color ??
              AVATAR_DEFAULT_CUSTOMIZATION.hair_color
            }
            shirtColor={
              customization.shirt_color ??
              AVATAR_DEFAULT_CUSTOMIZATION.shirt_color
            }
            pantsColor={
              customization.pants_color ??
              AVATAR_DEFAULT_CUSTOMIZATION.pants_color
            }
            shoesColor={
              customization.shoes_color ??
              AVATAR_DEFAULT_CUSTOMIZATION.shoes_color
            }
            hairStyle={
              customization.hair_style ??
              AVATAR_DEFAULT_CUSTOMIZATION.hair_style
            }
            showLoadingBackground={false}
          />
        )}

        {participants.length > 1 ? (
          <>
            <Pressable
              style={[styles.arrow, styles.arrowLeft]}
              onPress={() => goTo(-1)}
            >
              <Ionicons
                name="chevron-back"
                size={40}
                color="rgba(248,250,252,0.35)"
              />
            </Pressable>
            <Pressable
              style={[styles.arrow, styles.arrowRight]}
              onPress={() => goTo(1)}
            >
              <Ionicons
                name="chevron-forward"
                size={40}
                color="rgba(248,250,252,0.35)"
              />
            </Pressable>
          </>
        ) : null}
      </View>

      <Pressable
        style={styles.nameCard}
        onPress={() => router.push(`/friends/${participant.id}`)}
      >
        <View style={styles.nameRow}>
          <View style={styles.iconContainer}>
            <Ionicons name="person" size={20} color="#1A1A1A" />
          </View>
          <View style={styles.nameCenterArea}>
            <TextComponent
              message={participant?.name ?? ""}
              fontSize={18}
              fontWeight="bold"
            />
            {participant?.isCreator ? (
              <MaterialCommunityIcons name="crown" size={18} color="#E65C00" />
            ) : null}
          </View>
          <View style={styles.iconSpacer} />
        </View>
      </Pressable>

      {showAddFriend ? (
        <PressableComponent
          message="Add Friend"
          onPress={handleAddFriend}
          loading={addingFriend}
          width={180}
          marginTop={16}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  empty: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  carouselWrapper: {
    alignItems: "center",
    height: 240,
    justifyContent: "center",
    width: "100%",
  },
  arrow: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 56,
    zIndex: 10,
  },
  arrowLeft: {
    left: 0,
  },
  arrowRight: {
    right: 0,
  },
  avatarLoading: {
    alignItems: "center",
    height: 240,
    justifyContent: "center",
    width: 240,
  },
  nameCard: {
    backgroundColor: "#1A1A1A",
    borderColor: "#E65C00",
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: "80%",
  },
  nameRow: {
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  iconContainer: {
    alignItems: "center",
    backgroundColor: "#E65C00",
    borderRadius: 8,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  nameCenterArea: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
  },
  iconSpacer: {
    height: 36,
    width: 36,
  },
});
