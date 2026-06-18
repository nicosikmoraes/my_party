import Avatar3D from "@/components/avatar/Avatar3D";
import BlankTemplate from "@/components/template/Blank";
import { FriendWishlistItem } from "@/components/friends/FriendWishlistItem";
import ErrorComponent from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import TextComponent from "@/components/ui/Text";
import TitleComponent from "@/components/ui/Title";
import { AVATAR_DEFAULT_CUSTOMIZATION } from "@/constants/avatarItems";
import { getUserProfile } from "@/services/user";
import { FriendProfileGift, FriendProfileResponse } from "@/types/user";
import { showToast } from "@/utils/toast";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function FriendProfileScreen() {
  const { id } = useLocalSearchParams();
  const friendIdParam = Array.isArray(id) ? id[0] : id;
  const friendId =
    typeof friendIdParam === "string" ? Number(friendIdParam) : undefined;

  const [friendProfile, setFriendProfile] =
    useState<FriendProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedGiftIds, setExpandedGiftIds] = useState<number[]>([]);

  useEffect(() => {
    let cancelled = false;

    if (friendId !== undefined && !Number.isNaN(friendId)) {
      const fetchFriendProfile = async () => {
        try {
          setLoading(true);
          const data = await getUserProfile(friendId);

          if (cancelled) {
            return;
          }

          setFriendProfile(data);
          setError(null);
        } catch (err: any) {
          if (cancelled) {
            return;
          }

          const errorMessage =
            err.response?.data?.message || "Failed to load friend profile.";
          setError(errorMessage);
          showToast(errorMessage, "danger");
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };
      fetchFriendProfile();
    } else {
      setLoading(false);
      setError("Friend ID not found.");
      showToast("Friend ID not found.", "danger");
    }

    return () => {
      cancelled = true;
    };
  }, [friendId]);

  if (loading) {
    return (
      <BlankTemplate>
        <Loading visible={true} color="#E65C00" />
      </BlankTemplate>
    );
  }

  if (error) {
    return (
      <BlankTemplate>
        <Stack.Screen options={{ title: "Error" }} />
        <View style={styles.feedbackContainer}>
          <ErrorComponent message={error} />
        </View>
      </BlankTemplate>
    );
  }

  if (!friendProfile) {
    return (
      <BlankTemplate>
        <Stack.Screen options={{ title: "Not Found" }} />
        <View style={styles.feedbackContainer}>
          <TextComponent message="Friend profile not found." color="#B3B3B3" />
        </View>
      </BlankTemplate>
    );
  }

  const { user, wishlist } = friendProfile;
  const formatValue = (value?: string | number | null) =>
    value === null || value === undefined || value === "" ? "-" : String(value);

  const handleToggleGift = (giftId: number) => {
    setExpandedGiftIds((currentGiftIds) =>
      currentGiftIds.includes(giftId)
        ? currentGiftIds.filter((currentGiftId) => currentGiftId !== giftId)
        : [...currentGiftIds, giftId],
    );
  };

  return (
    <BlankTemplate>
      <Stack.Screen options={{ title: user.name }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TitleComponent message={user.name} fontSize={24} />

        <Avatar3D
          avatarUrl={user.avatar_url}
          size={340}
          skinColor={
            user.avatar_customization?.skin_color ||
            AVATAR_DEFAULT_CUSTOMIZATION.skin_color
          }
          hairColor={
            user.avatar_customization?.hair_color ||
            AVATAR_DEFAULT_CUSTOMIZATION.hair_color
          }
          shirtColor={
            user.avatar_customization?.shirt_color ||
            AVATAR_DEFAULT_CUSTOMIZATION.shirt_color
          }
          pantsColor={
            user.avatar_customization?.pants_color ||
            AVATAR_DEFAULT_CUSTOMIZATION.pants_color
          }
          shoesColor={
            user.avatar_customization?.shoes_color ||
            AVATAR_DEFAULT_CUSTOMIZATION.shoes_color
          }
          hairStyle={
            user.avatar_customization?.hair_style ||
            AVATAR_DEFAULT_CUSTOMIZATION.hair_style
          }
          shirtModel={
            user.avatar_customization?.shirt_model ||
            AVATAR_DEFAULT_CUSTOMIZATION.shirt_model
          }
          pantsModel={
            user.avatar_customization?.pants_model ||
            AVATAR_DEFAULT_CUSTOMIZATION.pants_model
          }
          shoesModel={
            user.avatar_customization?.shoes_model ||
            AVATAR_DEFAULT_CUSTOMIZATION.shoes_model
          }
        />

        <View style={styles.section}>
          <TextComponent
            message="Personal information"
            fontWeight="bold"
            fontSize={18}
          />
          <View style={styles.infoRow}>
            <TextComponent message="Shirt size: " color="#B3B3B3" />
            <TextComponent message={formatValue(user.shirt_size)} />
          </View>
          <View style={styles.infoRow}>
            <TextComponent message="Shoe size: " color="#B3B3B3" />
            <TextComponent message={formatValue(user.shoe_size)} />
          </View>
          <View style={styles.infoRow}>
            <TextComponent message="Pants size: " color="#B3B3B3" />
            <TextComponent message={formatValue(user.pants_size)} />
          </View>
          <View style={styles.infoRow}>
            <TextComponent message="Ring size: " color="#B3B3B3" />
            <TextComponent message={formatValue(user.ring_size)} />
          </View>
          <View style={styles.infoRow}>
            <TextComponent message="Favorite color: " color="#B3B3B3" />
            <TextComponent message={formatValue(user.prefered_color)} />
          </View>
        </View>

        <View style={styles.section}>
          <TextComponent message="Wishlist" fontWeight="bold" fontSize={18} />
          {wishlist.length === 0 ? (
            <TextComponent message="No wishlist items found" color="#B3B3B3" />
          ) : (
            wishlist.map((gift: FriendProfileGift) => (
              <FriendWishlistItem
                key={gift.id}
                gift={gift}
                isExpanded={expandedGiftIds.includes(gift.id)}
                onPress={() => handleToggleGift(gift.id)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </BlankTemplate>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    alignItems: "center",
    gap: 30,
  },
  section: {
    width: "100%",
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    padding: 15,
    gap: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  feedbackContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
