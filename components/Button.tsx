import {
  Text,
  StyleSheet,
  Pressable,
  GestureResponderEvent,
} from "react-native";

interface ButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  title: string;
  disabled?: boolean;
}

export default function Button(props: ButtonProps) {
  const { title, onPress, disabled = false } = props;
  return (
    <Pressable
      style={disabled ? [styles.button, styles.disabled] : styles.button}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 60,
    elevation: 3,
    backgroundColor: "rgb(78, 68, 206)",
  },
  disabled: {
    backgroundColor: "grey",
  },
  text: {
    fontSize: 16,
    lineHeight: 19,
    fontWeight: "600",
    color: "white",
  },
});
