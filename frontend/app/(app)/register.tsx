import CenteredTemplate from "@/components/template/Default";
import Input from "@/components/ui/Input";
import PressableComponent from "@/components/ui/Pressable";
import TextComponent from "@/components/ui/Text";
import TitleComponent from "@/components/ui/Title";
import { api } from "@/services/api";
import { saveToken } from "@/storage/auth";
import { showToast } from "@/utils/toast";
import { Link, router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useAuth } from "../../hooks/useAuth";

export default function Register() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  async function handleRegister() {
    setLoading(true);
    if (!validateInputs()) {
      return;
    }

    try {
      const response = await api.post("/register", {
        name,
        email,
        password,
      });

      const token: string = response.data.token;

      await saveToken(token);

      await signIn(email, password);

      router.replace("/(auth)/home");
      showToast("Account created with success", "success");
    } catch (error) {
      console.log("Erro no cadastro", error);
      setErrors((prev) => ({ ...prev, email: "Email already used" }));
    } finally {
      setLoading(false);
    }
  }

  function validateInputs() {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  return (
    <CenteredTemplate>
      <View style={styles.title_container}>
        <TitleComponent message="REGISTER NOW" fontSize={36} />

        <TextComponent
          message="Create your account for free"
          opacity={0.3}
          color="#FFFFFF"
          fontSize={15}
        />
      </View>

      <View style={styles.input_container}>
        <Input
          placeholder="Name"
          value={name}
          borderError={errors.name ? "red" : "transparent"}
          onChangeText={(text) => {
            (setName(text), setErrors({}));
          }}
          keyboardType="default"
          error={errors.name}
        />

        <Input
          placeholder="Email"
          value={email}
          borderError={errors.email ? "red" : "transparent"}
          onChangeText={(text) => {
            (setEmail(text), setErrors({}));
          }}
          keyboardType="email-address"
          error={errors.email}
        />

        <Input
          placeholder="Password"
          value={password}
          borderError={errors.password ? "red" : "transparent"}
          onChangeText={(text) => {
            (setPassword(text), setErrors({}));
          }}
          secureTextEntry
          autoComplete="new-password"
          error={errors.password}
        />

        <PressableComponent
          message="Register"
          onPress={handleRegister}
          loading={loading}
        />
      </View>

      <View style={styles.link_container}>
        <TextComponent
          message="Already have an account?"
          fontSize={14}
          fontWeight={"default"}
        />
        <Link href="/login" style={styles.link_login}>
          Login
        </Link>
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

  link_login: {
    alignSelf: "center",
    color: "#E65C00",
    opacity: 0.9,
  },

  link_container: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },
});
