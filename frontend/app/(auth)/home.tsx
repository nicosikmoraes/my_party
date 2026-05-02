import PersonalInformations from "@/components/home/PersonalInformations";
import Wishlist from "@/components/home/Wishlist";
import SideMenu from "@/components/menu/SideMenu";
import BlankTemplate from "@/components/template/Blank";
import IconButton from "@/components/ui/PressableIcon";
import TitleComponent from "@/components/ui/Title";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function Home() {
  const [menuVisible, setMenuVisible] = useState(false);

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

          <View style={styles.avatar}></View>
        </View>

        <PersonalInformations />

        <Wishlist />
      </ScrollView>

      <SideMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </BlankTemplate>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: "#F6BBC1",
    height: 300,
    width: 100,
    marginTop: 50,
    marginBottom: 50,
    borderRadius: 100,
  },

  avatar_container: {
    display: "flex",
    alignItems: "center",
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
