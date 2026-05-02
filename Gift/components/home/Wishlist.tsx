import { getUserGifts } from "@/services/gift";
import { showToast } from "@/utils/toast";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import GiftItem from "../gift/GiftItem";
import GiftModal from "../gift/GiftModal";
import PressableComponent from "../ui/Pressable";
import TitleComponent from "../ui/Title";

type Gift = {
  id: number;
  name: string;
  type: string;
  price?: number;
  description?: string;
  color?: string;
  quantity: number;
  is_purchased: boolean;
};

export default function Wishlist() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const filteredGifts = gifts.filter((gift) => !gift.is_purchased);
  const visibleGifts = filteredGifts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredGifts.length;
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadGifts();
    }, []),
  );

  async function loadGifts() {
    try {
      const data = await getUserGifts();
      setGifts(data);
    } catch (error) {
      showToast("Error loading gifts", "danger");
    }
  }

  function handleLoadMore() {
    setVisibleCount((prev) => prev + 5);
  }

  function handleShowLess() {
    setVisibleCount(5);
  }

  function handleOpenGift(gift: Gift) {
    setSelectedGift(gift);
    setModalVisible(true);
  }

  function handleCloseModal() {
    setModalVisible(false);
    setSelectedGift(null);
    loadGifts();
  }

  return (
    <View style={styles.wishlist_container}>
      <>
        <TitleComponent message="Wishlist" fontSize={20} />

        <View>
          <FlatList
            scrollEnabled={false}
            data={visibleGifts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <GiftItem gift={item} onPress={() => handleOpenGift(item)} />
            )}
          />

          {filteredGifts.length > 5 && (
            <>
              {hasMore ? (
                <PressableComponent
                  message="see more"
                  onPress={handleLoadMore}
                  backgroundColor="transparent"
                  color="#E65C00"
                  width={80}
                  height={20}
                  padding={0}
                  marginTop={-5}
                />
              ) : (
                <PressableComponent
                  message="see less"
                  onPress={handleShowLess}
                  backgroundColor="transparent"
                  color="#E65C00"
                  width={80}
                  height={20}
                  padding={0}
                  marginTop={-5}
                />
              )}
            </>
          )}
        </View>

        <PressableComponent
          message="Add new gift"
          onPress={() => router.push("/(auth)/details/wishlist")}
        />
      </>

      <GiftModal
        visible={modalVisible}
        gift={selectedGift}
        onClose={handleCloseModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wishlist_container: {
    marginTop: 40,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
});
