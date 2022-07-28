import { Dispatch } from "react";
import { TextInput, StyleSheet } from "react-native";
import { COLORS } from "../constants";

interface InputProps {
  value: string;
  placeholder: string;
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
      placeholderTextColor={COLORS.LIGHT_GREY}
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
    backgroundColor: COLORS.DARKER_GREY_2,
    borderColor: COLORS.GREY_2,
    borderRadius: 6,
    color: COLORS.WHITE,
    fontSize: 16,
  },
});
