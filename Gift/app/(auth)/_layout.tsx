import { Redirect, Stack } from "expo-router";
import { useContext } from "react";
import FlashMessage from "react-native-flash-message";
import { AuthContext, AuthProvider } from "../../context/AuthContext";
import "../../global.css";

export default function AppLayout() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (!user) {
    console.log("User not authenticate");
    return <Redirect href="/login" />;
  }

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerTitle: "",
          headerShadowVisible: false,
          headerShown: false,
          contentStyle: {
            backgroundColor: "#0F0F0F",
          },
        }}
      />
      <FlashMessage />
    </AuthProvider>
  );
}
