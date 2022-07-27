import {
  Text,
  StyleSheet,
  Pressable,
  GestureResponderEvent,
} from "react-native";

interface ButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  title: string;
}

export default function Button(props: ButtonProps) {
  return (
    <Pressable style={styles.button} onPress={props.onPress}>
      <Text style={styles.text}>{props.title}</Text>
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
  text: {
    fontSize: 16,
    lineHeight: 19,
    fontWeight: "600",
    color: "white",
  },
});
