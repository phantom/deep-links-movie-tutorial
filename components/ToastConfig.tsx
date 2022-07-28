import { Linking } from "react-native";
import { BaseToast, ErrorToast } from "react-native-toast-message";
import { COLORS } from "../constants";

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      text1Style={{
        fontSize: 17,
        fontWeight: "400",
      }}
      text2Style={{
        fontSize: 12,
      }}
      text2NumberOfLines={10}
      style={{
        borderLeftColor: COLORS.GREEN,
        paddingTop: 20,
        paddingBottom: 20,
        height: "100%",
      }}
      onPress={() => {
        Linking.openURL(
          `https://explorer.solana.com/tx/${props.text2}?cluster=devnet`
        );
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
        fontWeight: "400",
      }}
      text2Style={{
        fontSize: 12,
      }}
      text2NumberOfLines={10}
      style={{
        borderLeftColor: COLORS.RED,
        paddingTop: 20,
        paddingBottom: 20,
        height: "100%",
      }}
    />
  ),
};
