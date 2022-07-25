import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import { Buffer } from "buffer";
global.Buffer = global.Buffer || Buffer;
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, SafeAreaView } from "react-native";
import * as Linking from "expo-linking";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { PublicKey } from "@solana/web3.js";
import { decryptPayload } from "./utils/decryptPayload";
import { encryptPayload } from "./utils/encryptPayload";
import { buildUrl } from "./utils/buildUrl";
import { MovieList } from "./components/MovieList";

const onConnectRedirectLink = Linking.createURL("onConnect");
const onDisconnectRedirectLink = Linking.createURL("onDisconnect");

export default function App() {
  const [deeplink, setDeepLink] = useState<string>("");
  const [dappKeyPair] = useState(nacl.box.keyPair());

  const [sharedSecret, setSharedSecret] = useState<Uint8Array>();
  const [session, setSession] = useState<string>();
  const [phantomWalletPublicKey, setPhantomWalletPublicKey] =
    useState<PublicKey | null>();

  useEffect(() => {
    const initializeDeeplinks = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        setDeepLink(initialUrl);
      }
    };
    initializeDeeplinks();
    const listener = Linking.addEventListener("url", handleDeepLink);
    return () => {
      listener.remove();
    };
  }, []);

  const handleDeepLink = ({ url }: Linking.EventType) => setDeepLink(url);

  // Handle in-bound links
  useEffect(() => {
    if (!deeplink) return;

    const url = new URL(deeplink);
    const params = url.searchParams;

    if (params.get("errorCode")) {
      console.log(
        "error: ",
        JSON.stringify(Object.fromEntries([...params]), null, 2)
      );
      return;
    }

    // Handle a `connect` response from Phantom
    if (/onConnect/.test(url.pathname)) {
      const sharedSecretDapp = nacl.box.before(
        bs58.decode(params.get("phantom_encryption_public_key")!),
        dappKeyPair.secretKey
      );

      const connectData = decryptPayload(
        params.get("data")!,
        params.get("nonce")!,
        sharedSecretDapp
      );

      setSharedSecret(sharedSecretDapp);
      setSession(connectData.session);
      setPhantomWalletPublicKey(new PublicKey(connectData.public_key));
      console.log(`connected to ${connectData.public_key.toString()}`);
    }

    // Handle a `disconnect` response from Phantom
    if (/onDisconnect/.test(url.pathname)) {
      setPhantomWalletPublicKey(null);
      console.log("disconnected");
    }
  }, [deeplink]);

  // Initiate a new connection to Phantom
  const connect = async () => {
    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
      cluster: "devnet",
      app_url: "https://phantom.app",
      redirect_link: onConnectRedirectLink,
    });

    const url = buildUrl("connect", params);

    Linking.openURL(url);
  };

  // Initiate a disconnect from Phantom
  const disconnect = async () => {
    const payload = {
      session,
    };

    const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret);

    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
      nonce: bs58.encode(nonce),
      redirect_link: onDisconnectRedirectLink,
      payload: bs58.encode(encryptedPayload),
    });

    const url = buildUrl("disconnect", params);

    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>Deep Links Movie Tutorial</Text>
      {phantomWalletPublicKey ? (
        <>
          <Text>Connected with:</Text>
          <Text>{phantomWalletPublicKey.toString()}</Text>
          <Button title="Disconnect" onPress={disconnect} />
        </>
      ) : (
        <Button title="Connect Phantom" onPress={connect} />
      )}
      <MovieList />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(34, 34, 34)",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
});
