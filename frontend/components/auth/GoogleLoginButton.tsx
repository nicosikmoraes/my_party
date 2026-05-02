import { useAuth } from "@/hooks/useAuth";
import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import * as Google from "expo-auth-session/providers/google";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLoginButton() {
  const { signInWithGoogle } = useAuth();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "62393066471-k7u83h6vk2sq1t7el0skc9j36pofom2c.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const token = response.authentication?.accessToken;

      if (token) {
        handleGoogleLogin(token);
      }
    }
  }, [response]);

  async function handleGoogleLogin(token: string) {
    try {
      await signInWithGoogle(token);

      router.replace("/(auth)/home");
    } catch (error) {
      console.log("Erro login Google", error);
    }
  }

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <View style={{ marginBottom: 0 }}>
      <Pressable
        onPress={() => promptAsync()}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <View style={styles.content}>
          {/* 🔥 Ícone do Google */}
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
            }}
            style={styles.icon}
          />

          <Text style={styles.text}>{"Login with Google"}</Text>
          <View style={styles.icon}></View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    opacity: 0.9,
  },

  pressed: {
    opacity: 0.7,
  },

  disabled: {
    opacity: 0.5,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
  },

  icon: {
    width: 20,
    height: 20,
  },

  text: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
    fontFamily: "Roboto_400Regular",
  },
});
