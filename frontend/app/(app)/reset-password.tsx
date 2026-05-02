import CenteredTemplate from "@/components/template/Default";
import ErrorComponent from "@/components/ui/Error";
import Input from "@/components/ui/Input";
import PressableComponent from "@/components/ui/Pressable";
import TitleComponent from "@/components/ui/Title";
import { api } from "@/services/api";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function Login() {
  const { token, email } = useLocalSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmaPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setPassword("");
      setError("");
      setConfirmaPassword("");
    }, []),
  );

  async function handleReset() {
    try {
      setLoading(true);

      if (password != confirmPassword) {
        setError("Diferent passwords");
        return;
      }

      const cleanPassword = password.trim();
      const cleanConfirm = confirmPassword.trim();

      const response = await api.post("/reset-password", {
        token,
        email,
        password: cleanPassword,
        password_confirmation: cleanConfirm,
      });

      router.replace("/login");

      alert(response.data.message);
    } catch (err: any) {
      alert("Error to redefine password");
      console.log(err.response?.data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <CenteredTemplate>
      <TitleComponent message="Type your new password" fontSize={28} />

      <View style={styles.input_container}>
        <View>
          <Input
            placeholder="Passoword"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError("");
            }}
            secureTextEntry
            autoComplete="new-password"
          />
        </View>

        <View>
          <Input
            placeholder="Confirm Password"
            value={confirmPassword}
            borderError={error ? "red" : "transparent"}
            onChangeText={(text) => {
              setConfirmaPassword(text);
              setError("");
            }}
            secureTextEntry
            autoComplete="new-password"
          />

          {error ? <ErrorComponent message={error} /> : null}
        </View>

        <PressableComponent
          message={loading ? "Loading" : "Confirm new Password"}
          marginTop={10}
          onPress={handleReset}
        />
      </View>
    </CenteredTemplate>
  );
}

const styles = StyleSheet.create({
  input_container: {
    display: "flex",
    gap: 10,
    width: "90%",
    marginTop: 15,
  },
});
