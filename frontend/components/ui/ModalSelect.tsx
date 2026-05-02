import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import TextComponent from "./Text";

type Option = {
  label: string;
  value: string;
};

type Props = {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  width?: any;
  label?: string;
};

export default function SelectModal({
  options,
  value,
  onChange,
  placeholder = "Select...",
  error,
  width = "100%",
  label = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selected = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={{ width }}>
      {label ? (
        <View style={{ marginBottom: 5 }}>
          <TextComponent message={label} textAlign="left" />
        </View>
      ) : null}

      <Pressable
        style={[styles.select, { borderColor: error ? "red" : "#1A1A1A" }]}
        onPress={() => setOpen(true)}
      >
        <Text style={styles.text}>
          {selected ? selected.label : placeholder}
        </Text>
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.modal}>
            <TextInput
              placeholder="Search..."
              placeholderTextColor="#999"
              value={search}
              onChangeText={setSearch}
              style={styles.search}
            />

            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.value}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.option,
                    item.value === value && styles.selectedOption,
                  ]}
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <Text style={styles.text}>{item.label}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  select: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 4,
    backgroundColor: "#1A1A1A",
    height: 45,
    justifyContent: "center",
  },

  text: {
    color: "#B3B3B3",
    fontSize: 16,
  },

  error: {
    color: "red",
    marginTop: 4,
    fontSize: 12,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },

  modal: {
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    maxHeight: "70%",
    padding: 10,
  },

  search: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 6,
    padding: 10,
    color: "#fff",
    marginBottom: 10,
  },

  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },

  selectedOption: {
    backgroundColor: "#E65C00",
  },
});
