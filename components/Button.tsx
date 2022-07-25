import { Text, StyleSheet, Pressable } from "react-native";

export default function Button(props: any) {
  const { onPress, title = "Save" } = props;
  return (
    <Pressable style={styles.button} onPress={onPress}>
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
  text: {
    fontSize: 16,
    lineHeight: 19,
    fontWeight: "600",
    color: "white",
  },
});
