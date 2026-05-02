import BlankTemplate from "@/components/template/Blank";
import TextComponent from "@/components/ui/Text";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import PressableComponent from "@/components/ui/Pressable";

export default function Events() {
  const router = useRouter();
  return (
    <BlankTemplate>
      <TextComponent message="EVENTS" />

      <PressableComponent
        message="Ir para TestScreen"
        onPress={() => router.push("/(auth)/test")}
        marginTop={20}
      />
    </BlankTemplate>
  );
}

const styles = StyleSheet.create({});
