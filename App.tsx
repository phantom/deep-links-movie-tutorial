import "react-native-get-random-values";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import * as Linking from "expo-linking";
import nacl from "tweetnacl";
import bs58 from "bs58";

const BASE_URL = "https://phantom.app/ul/v1/";

const onConnectRedirectLink = Linking.createURL("onConnect");

export default function App() {
  const [dappKeyPair] = useState(nacl.box.keyPair());

  const connect = async () => {
    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
      cluster: "devnet",
      app_url: "https://phantom.app",
      redirect_link: onConnectRedirectLink,
    });

    const myUrl = `${BASE_URL}connect?${params.toString()}`;

    Linking.openURL(myUrl);
  };

  return (
    <View style={styles.container}>
      <Text>Phantom Deeplinking Tutorial</Text>
      <Button title="Connect" onPress={connect} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
