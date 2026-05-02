import BlankTemplate from "@/components/template/Blank";
import InputComponent from "@/components/ui/Input";
import InputNumberComponent from "@/components/ui/InputNumerico";
import SelectModal from "@/components/ui/ModalSelect";
import PressableComponent from "@/components/ui/Pressable";
import TextAreaComponent from "@/components/ui/TextArea";
import TitleComponent from "@/components/ui/Title";
import { getColors } from "@/services/color";
import { createGift, getGiftTypes } from "@/services/gift";
import { showToast } from "@/utils/toast";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function WishlistDetails() {
  const [types, setTypes] = useState<any[]>([]);
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [colors, setColors] = useState([]);
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    type?: string;
    price?: string;
    quantity?: string;
  }>({});

  useEffect(() => {
    async function loadTypes() {
      const data = await getGiftTypes();
      setTypes(data);
    }

    loadTypes();
  }, []);

  useEffect(() => {
    async function load() {
      const data = await getColors();
      setColors(data);
    }

    load();
  }, []);

  function validateInputs() {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!type) {
      newErrors.type = "Type is required";
    }

    if (price) {
      const raw = price.replace(/[^\d]/g, "");
      if (isNaN(Number(raw))) {
        newErrors.price = "Invalid price";
      }
    }

    if (quantity) {
      if (Number(quantity) <= 0) {
        newErrors.quantity = "Invalid quantity";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function hanldeWishlist() {
    if (!validateInputs()) return;

    try {
      setLoading(true);

      const payload: any = {
        name,
        type,
      };

      if (price) {
        payload.price = Number(price.replace(/[^\d]/g, "")) / 100;
      }

      if (quantity) {
        payload.quantity = Number(quantity);
      }

      if (description) payload.description = description;
      if (color) payload.color = color;

      await createGift(payload);

      router.replace("/(auth)/home");
      showToast("Gift created successfully", "success");

      setErrors({});
    } catch (error: any) {
      const message = error?.response?.data?.message || "Error creating gift";

      showToast(message, "danger");
    } finally {
      setLoading(false);
    }
  }

  return (
    <BlankTemplate>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <>
          <View style={styles.container}>
            <View style={{ marginBottom: 10 }}>
              <TitleComponent message="Add a new suggestion" fontSize={20} />
            </View>

            <InputComponent
              label="Title"
              placeholder="Title"
              value={name}
              borderError={errors.name ? "red" : "transparent"}
              onChangeText={(text) => {
                setName(text);
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              error={errors.name}
            />

            <View style={styles.price_quantity_container}>
              <SelectModal
                value={type}
                onChange={(value) => {
                  setType(value);
                  setErrors((prev) => ({ ...prev, type: undefined }));
                }}
                options={types}
                label="Type"
                placeholder="Select type"
                width="49%"
                error={errors.type}
              />

              <SelectModal
                value={color}
                onChange={setColor}
                width="49%"
                options={colors}
                label="Color"
                placeholder="Select"
              />
            </View>

            <View style={styles.price_quantity_container}>
              <InputNumberComponent
                label="Estimate price"
                placeholder="$"
                value={price}
                borderError={errors.price ? "red" : "transparent"}
                onChangeText={(text) => {
                  setPrice(text);
                  setErrors(() => ({ price: undefined }));
                }}
                error={errors.price}
                amount={20}
                currency={true}
                width="49%"
              />
              <InputNumberComponent
                label="Quantity"
                placeholder="Value"
                value={quantity}
                borderError={errors.quantity ? "red" : "transparent"}
                onChangeText={(text) => {
                  setQuantity(text);
                  setErrors((prev) => ({ ...prev, quantity: undefined }));
                }}
                error={errors.quantity}
                amount={3}
                width="49%"
              />
            </View>

            <TextAreaComponent
              label="Description"
              placeholder="Write a description about this gift..."
              value={description}
              onChangeText={setDescription}
            />

            <PressableComponent
              message="Create suggestion"
              onPress={hanldeWishlist}
              marginTop={10}
              loading={loading}
            />
          </View>
        </>
      </ScrollView>
    </BlankTemplate>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    padding: 20,
  },
  price_quantity_container: {
    display: "flex",
    flexDirection: "row",
    gap: "2%",
  },
});
