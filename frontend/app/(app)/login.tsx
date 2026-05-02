import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import CenteredTemplate from "@/components/template/Default";
import Input from "@/components/ui/Input";
import PressableComponent from "@/components/ui/Pressable";
import TextComponent from "@/components/ui/Text";
import TitleComponent from "@/components/ui/Title";
import { useAuth } from "@/hooks/useAuth";
import { showToast } from "@/utils/toast";
import { Link, router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";

enum TypeError {
  Password,
  Email,
  None,
}

export default function Login() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setEmail("");
      setPassword("");
      setErrors({});
    }, []),
  );

  function validateInputs() {
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";

    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleLogin() {
    if (!validateInputs()) return;

    try {
      setLoading(true);
      await signIn(email, password);
      router.replace("/(auth)/home");
      showToast("Loged with success", "success");
    } catch (err: any) {
      setErrors({
        email: "Email or password is incorrect",
        password: "Email or password is incorrect",
      });
      setPassword("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CenteredTemplate>
      <View style={styles.title_container}>
        <TitleComponent message="welcome back" fontSize={36} />

        <TextComponent
          message="Sign in to your account"
          opacity={0.3}
          color="#FFFFFF"
          fontSize={15}
        />
      </View>

      <View style={styles.input_container}>
        <GoogleLoginButton />

        <Input
          placeholder="Email"
          value={email}
          borderError={errors.email ? "red" : "transparent"}
          onChangeText={(text) => {
            setEmail(text);
            setErrors({});
          }}
          keyboardType="email-address"
          error={errors.email}
        />

        <View>
          <Input
            placeholder="Password"
            value={password}
            borderError={errors.password ? "red" : "transparent"}
            onChangeText={(text) => {
              setPassword(text);
              setErrors({});
            }}
            secureTextEntry
            autoComplete="new-password"
            error={errors.password}
          />

          <View style={styles.forgot_password_container}>
            <TextComponent
              message="Forgot Password?"
              textAlign="left"
              color="#E65C00"
              fontWeight={900}
              fontSize={12}
              onPress={() => router.push("/forgot-password")}
            />
          </View>
        </View>

        <PressableComponent
          message={"Send"}
          marginTop={10}
          loading={loading}
          onPress={handleLogin}
        />
      </View>

      <View style={styles.link_container}>
        <TextComponent
          message="Don't have an account?"
          fontSize={14}
          fontWeight={"regular"}
          color="#FFFFFF"
        />
        <Link href="/register" style={styles.link_login}>
          Create account
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

  forgot_password_container: {
    marginTop: 10,
  },
});
