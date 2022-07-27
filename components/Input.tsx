import { Dispatch, SetStateAction } from "react";
import { TextInput, StyleSheet } from "react-native";

interface InputProps {
  value: string;
  placeholder: string;
  // onChangeText: Dispatch<SetStateAction<string>>;
  onChangeText: Dispatch<string>;
  keyboardType?: "default" | "numeric";
}

export default function Input({
  value,
  placeholder,
  onChangeText,
  keyboardType = "default",
}: InputProps) {
  return (
    <TextInput
      value={value}
      placeholder={placeholder}
      keyboardType={keyboardType}
      placeholderTextColor="rgb(119, 119, 119)"
      onChangeText={onChangeText}
      style={styles.input}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    margin: 12,
    borderWidth: 1,
    padding: 14,
    backgroundColor: "rgb(24, 24, 24)",
    borderColor: "rgb(91, 91, 91)",
    borderRadius: 6,
    color: "white",
    fontSize: 16,
  },
});
