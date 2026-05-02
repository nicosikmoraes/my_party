import { useState } from "react";
import {
  FlatList,
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

export default function Select({
  options,
  value,
  onChange,
  placeholder = "Select...",
  error,
  width = "100%",
  label = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [search, setSearch] = useState("");

  const selected = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
  );

  function handleOpen() {
    setOpen(true);
    setFocused(true);
    setSearch("");
  }

  function handleClose() {
    setOpen(false);
    setFocused(false);
  }

  return (
    <View style={{ width, position: "relative" }}>
      <TextComponent message={label} textAlign="left" />

      {/* Overlay (fecha ao clicar fora) */}
      {open && <Pressable style={styles.overlay} onPress={handleClose} />}

      {/* Campo */}
      <Pressable
        style={[
          styles.select,
          {
            borderColor: error ? "red" : focused ? "#E65C00" : "#1A1A1A",
            marginTop: 5,
          },
        ]}
        onPress={handleOpen}
      >
        <TextInput
          style={styles.text}
          placeholder={placeholder}
          placeholderTextColor="#666"
          value={open ? search : selected?.label || ""}
          onChangeText={setSearch}
          onFocus={handleOpen}
        />
      </Pressable>

      {/* Dropdown */}
      {open && (
        <View style={styles.dropdown}>
          {filteredOptions.length === 0 ? (
            <Text style={styles.empty}>No results found</Text>
          ) : (
            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.value}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable
                  style={styles.option}
                  onPress={() => {
                    onChange(item.value);
                    setSearch(item.label);
                    handleClose();
                  }}
                >
                  <Text style={styles.text}>{item.label}</Text>
                </Pressable>
              )}
            />
          )}
        </View>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  select: {
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: "#1A1A1A",
    height: 45,
    justifyContent: "center",
  },

  text: {
    color: "#B3B3B3",
    fontSize: 16,
  },

  dropdown: {
    position: "absolute",
    top: 70,
    width: "100%",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 4,
    backgroundColor: "#1A1A1A",
    maxHeight: 150,
    zIndex: 999,
    elevation: 10,
  },

  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },

  overlay: {
    position: "absolute",
    top: -1000,
    bottom: -1000,
    left: -1000,
    right: -1000,
    zIndex: 998,
  },

  empty: {
    color: "#666",
    padding: 12,
    textAlign: "center",
  },

  error: {
    color: "red",
    marginTop: 4,
    fontSize: 12,
  },
});
