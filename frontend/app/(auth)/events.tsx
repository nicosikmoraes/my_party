import BlankTemplate from "@/components/template/Blank";
import PressableComponent from "@/components/ui/Pressable";
import TextComponent from "@/components/ui/Text";
import { useAuth } from "@/hooks/useAuth";
import { StyleSheet } from "react-native";

export default function Events() {
  const { user, signOut } = useAuth();

  return (
    <BlankTemplate>
      <TextComponent message="EVENTS" />

      <TextComponent message={user.name} />

      <PressableComponent
        message="Logout"
        marginTop={20}
        onPress={signOut}
        backgroundColor="#E65C00"
      />
    </BlankTemplate>
  );
}

const styles = StyleSheet.create({});
