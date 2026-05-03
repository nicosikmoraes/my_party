import { useAuth } from "@/hooks/useAuth";
import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import * as Google from "expo-auth-session/providers/google";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID =
  "62393066471-k7u83h6vk2sq1t7el0skc9j36pofom2c.apps.googleusercontent.com";

export default function GoogleLoginButton() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: WEB_CLIENT_ID,
    scopes: ["profile", "email"],
  });

  useEffect(() => {
    if (Platform.OS !== "web") return;

    if (response?.type === "success") {
      const token = response.authentication?.accessToken;

      if (token) {
        handleBackendGoogleLogin(token);
      }
    }
  }, [response]);

  async function handleBackendGoogleLogin(token: string) {
    try {
      setLoading(true);

      await signInWithGoogle(token);

      router.replace("/(auth)/home");
    } catch (error: any) {
      console.log("Erro login Google backend", error?.message || error);
    } finally {
      setLoading(false);
    }
  }

  async function handleNativeGoogleLogin() {
    try {
      setLoading(true);

      const { GoogleSignin, statusCodes } =
        await import("@react-native-google-signin/google-signin");

      GoogleSignin.configure({
        webClientId: WEB_CLIENT_ID,
        scopes: ["profile", "email"],
      });

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const userInfo = await GoogleSignin.signIn();

      console.log("Google native userInfo:", userInfo);

      const tokens = await GoogleSignin.getTokens();

      console.log("Google native tokens:", {
        hasAccessToken: !!tokens.accessToken,
        hasIdToken: !!tokens.idToken,
      });

      if (!tokens.accessToken) {
        throw new Error("Google access token not found");
      }

      await handleBackendGoogleLogin(tokens.accessToken);
    } catch (error: any) {
      const { statusCodes } =
        await import("@react-native-google-signin/google-signin");

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("Login Google cancelado pelo usuário");
        return;
      }

      if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Login Google já está em andamento");
        return;
      }

      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Google Play Services não disponível ou desatualizado");
        return;
      }

      console.log("Erro login Google native:", {
        code: error?.code,
        message: error?.message,
        error,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handlePress() {
    if (Platform.OS === "web") {
      await promptAsync();
      return;
    }

    await handleNativeGoogleLogin();
  }

  if (!fontsLoaded) return null;

  return (
    <View style={{ marginBottom: 0 }}>
      <Pressable
        onPress={handlePress}
        disabled={loading}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.pressed,
          loading && styles.disabled,
        ]}
      >
        <View style={styles.content}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
            }}
            style={styles.icon}
          />

          <Text style={styles.text}>
            {loading ? "Loading..." : "Login with Google"}
          </Text>

          <View style={styles.icon} />
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
