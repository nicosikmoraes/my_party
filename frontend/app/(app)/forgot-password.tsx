import CenteredTemplate from "@/components/template/Default";
import ErrorComponent from "@/components/ui/Error";
import InputComponent from "@/components/ui/Input";
import PressableComponent from "@/components/ui/Pressable";
import TextComponent from "@/components/ui/Text";
import TitleComponent from "@/components/ui/Title";
import { api } from "@/services/api";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleForgotPassword() {
    if (!email) {
      setError("Insert a valid email");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/forgot-password", {
        email,
      });

      alert(response.data.message);
    } catch (error: any) {
      setError("Email not found");
      setEmail("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CenteredTemplate>
      <View style={styles.title_container}>
        <TitleComponent message="Reset your password" fontSize={24} />

        <TextComponent
          message="Insert your email"
          opacity={0.3}
          color="#FFFFFF"
          fontSize={15}
        />
      </View>

      <View style={styles.input_container}>
        <View>
          <InputComponent
            placeholder="Email"
            value={email}
            borderError={error ? "red" : "transparent"}
            keyboardType="email-address"
            onChangeText={(text) => {
              setEmail(text);
              setError("");
            }}
          />
          {error ? <ErrorComponent message={error} /> : null}
        </View>

        <PressableComponent
          marginTop={10}
          message={loading ? "loading..." : "Send email"}
          onPress={handleForgotPassword}
        />
      </View>
    </CenteredTemplate>
  );
}

const styles = StyleSheet.create({
  title_container: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 25,
  },
  input_container: {
    display: "flex",
    gap: 10,
    width: "90%",
  },
});
