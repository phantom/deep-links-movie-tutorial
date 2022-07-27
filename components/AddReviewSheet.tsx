import {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { RefObject, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { MOVIE_REVIEW_PROGRAM_ID } from "../constants";
import { Movie } from "../models/Movie";
import Button from "./Button";
import Input from "./Input";

interface AddReviewSheetProps {
  actionSheetRef: RefObject<ActionSheet>;
  phantomWalletPublicKey: PublicKey | null;
  signAndSendTransaction: Function;
}

interface InputValues {
  title: string;
  rating: string;
  description: string;
}

const MAX_RATING = 5;

const INITIAL_STATE = {
  title: "",
  rating: "",
  description: "",
};

export default function AddReviewSheet(props: AddReviewSheetProps) {
  const { phantomWalletPublicKey, signAndSendTransaction } = props;
  const [values, setValues] = useState<InputValues>(INITIAL_STATE);

  const checkRatingLimit = (rating: string) => {
    const parsedRating = parseInt(rating);
    if (parsedRating > MAX_RATING) {
      return MAX_RATING.toString();
    }
    return rating;
  };

  const handleChange = (field: keyof InputValues, value: string) => {
    let checkedValue = value;
    if (field === "rating") {
      checkedValue = checkRatingLimit(value);
    }
    setValues((prevValues) => ({ ...prevValues, [field]: checkedValue }));
  };

  const handleSubmit = async () => {
    if (!phantomWalletPublicKey) return;
    const movie = new Movie(
      values.title,
      parseInt(values.rating),
      values.description
    );
    const instructionDataBuffer = movie.serialize();
    const transaction = new Transaction();
    const [pda] = await PublicKey.findProgramAddress(
      [phantomWalletPublicKey.toBuffer(), Buffer.from(movie.title)],
      new PublicKey(MOVIE_REVIEW_PROGRAM_ID)
    );
    const instruction = new TransactionInstruction({
      keys: [
        {
          pubkey: phantomWalletPublicKey,
          isSigner: true,
          isWritable: false,
        },
        {
          pubkey: pda,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
      ],
      data: instructionDataBuffer,
      programId: new PublicKey(MOVIE_REVIEW_PROGRAM_ID),
    });
    transaction.add(instruction);
    signAndSendTransaction(transaction);
    setValues(INITIAL_STATE);
  };

  return (
    <ActionSheet ref={props.actionSheetRef} containerStyle={styles.sheet}>
      <View style={styles.form}>
        <View style={styles.fields}>
          <Input
            value={values.title}
            placeholder="Movie title"
            onChangeText={(newText) => handleChange("title", newText)}
          />
          <Input
            value={values.description}
            placeholder="Add your review"
            onChangeText={(newText) => handleChange("description", newText)}
          />
          <Input
            value={values.rating}
            keyboardType="numeric"
            placeholder="Rating out of 5"
            onChangeText={(newText) => handleChange("rating", newText)}
          />
        </View>
        <Button
          title="Submit Review"
          onPress={handleSubmit}
          disabled={!values.title || !values.rating || !values.description}
        />
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  fields: {
    marginBottom: 20,
  },
  form: {
    paddingTop: 10,
    paddingBottom: 50,
  },
  sheet: {
    backgroundColor: "rgb(34, 34, 34)",
  },
});
