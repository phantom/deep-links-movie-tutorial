import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import { Buffer } from "buffer";
global.Buffer = global.Buffer || Buffer;
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import MovieList from "./components/MovieList";
import Button from "./components/Button";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import ActionSheet from "react-native-actions-sheet";
import AddReviewSheet from "./components/AddReviewSheet";
import Toast from "react-native-toast-message";
import { toastConfig } from "./components/ToastConfig";
import { COLORS } from "./constants";
import * as Linking from "expo-linking";

const connection = new Connection(clusterApiUrl("devnet"));

export default function App() {
  const [phantomWalletPublicKey, setPhantomWalletPublicKey] =
    useState<PublicKey | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const actionSheetRef = useRef<ActionSheet>(null);

  // Initiate a new connection to Phantom
  const connect = async () => {};

  // Initiate a disconnect from Phantom
  const disconnect = async () => {};

  // Initiate a new transaction via Phantom. We call this in `components/AddReviewSheet.tsx` to send our movie review to the Solana network
  const signAndSendTransaction = async (transaction: Transaction) => {};

  // Open the 'Add a Review' sheet defined in `components/AddReviewSheet.tsx`
  const openAddReviewSheet = () => {
    actionSheetRef.current?.show();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          {phantomWalletPublicKey ? (
            <>
              <View style={[styles.row, styles.wallet]}>
                <View style={styles.greenDot} />
                <Text
                  style={styles.text}
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  {`Connected to: ${phantomWalletPublicKey.toString()}`}
                </Text>
              </View>
              <View style={styles.row}>
                <Button title="Add Review" onPress={openAddReviewSheet} />
                <Button title="Disconnect" onPress={disconnect} />
              </View>
            </>
          ) : (
            <View style={{ marginTop: 15 }}>
              <Button title="Connect Phantom" onPress={connect} />
            </View>
          )}
        </View>
        {submitting && (
          <ActivityIndicator
            color={COLORS.WHITE}
            size="large"
            style={styles.spinner}
          />
        )}
        <MovieList connection={connection} />
        <AddReviewSheet
          actionSheetRef={actionSheetRef}
          phantomWalletPublicKey={phantomWalletPublicKey}
          signAndSendTransaction={signAndSendTransaction}
        />
        <Toast config={toastConfig} />
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.DARK_GREY,
    flexGrow: 1,
    position: "relative",
  },
  greenDot: {
    height: 8,
    width: 8,
    borderRadius: 10,
    marginRight: 5,
    backgroundColor: COLORS.GREEN,
  },
  header: {
    width: "95%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  spinner: {
    position: "absolute",
    alignSelf: "center",
    top: "50%",
    zIndex: 1000,
  },
  text: {
    color: COLORS.LIGHT_GREY,
    width: "100%",
  },
  wallet: {
    alignItems: "center",
    margin: 10,
    marginBottom: 15,
  },
});
