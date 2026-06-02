import Avatar3D from "@/components/avatar/Avatar3D";
import PersonalInformations from "@/components/home/PersonalInformations";
import Wishlist from "@/components/home/Wishlist";
import SideMenu from "@/components/menu/SideMenu";
import BlankTemplate from "@/components/template/Blank";
import IconButton from "@/components/ui/PressableIcon";
import TitleComponent from "@/components/ui/Title";
import { useAuth } from "@/hooks/useAuth";
import { getAvatarCustomization } from "@/services/avatarCustomizationService";
import { AvatarCustomization } from "@/types/avatar";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function Home() {
  const { user } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [avatarCustomization, setAvatarCustomization] =
    useState<AvatarCustomization | null>(null);

  const fetchAvatarData = useCallback(async () => {
    try {
      const data = await getAvatarCustomization();
      setAvatarCustomization(data);
    } catch (error) {
      console.error("Failed to load avatar customization for home screen", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAvatarData();
    }, [fetchAvatarData]),
  );

  return (
    <BlankTemplate>
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatar_container}>
          <View style={styles.header}>
            <TitleComponent message="PROFILE" fontSize={20} />

            <View style={styles.icon}>
              <IconButton
                icon={<Ionicons name="menu" size={33} color={"#F8FAFC"} />}
                onPress={() => setMenuVisible(true)}
              />
            </View>
          </View>

          <Avatar3D
            avatarUrl={user?.avatar_url}
            size={340}
            skinColor={avatarCustomization?.skin_color || "#F2C6A0"}
            hairColor={avatarCustomization?.hair_color || "#2B1A10"}
            shirtColor={avatarCustomization?.shirt_color || "#E65C00"}
            pantsColor={avatarCustomization?.pants_color || "#333333"}
            shoesColor={avatarCustomization?.shoes_color || "#111111"}
            showLoadingBackground={false}
            onPress={() => router.push("/avatar/customize")}
          />
        </View>

        <PersonalInformations />

        <Wishlist />
      </ScrollView>

      <SideMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </BlankTemplate>
  );
}

const styles = StyleSheet.create({
  avatar_container: {
    display: "flex",
    alignItems: "center",
    gap: 24,
  },

  person_informations_container: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },

  header: {
    position: "relative",
    width: "100%",
    display: "flex",
    alignItems: "center",
  },

  icon: {
    position: "absolute",
    right: 0,
  },
});
