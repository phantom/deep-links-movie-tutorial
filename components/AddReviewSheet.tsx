import { useState } from "react";
import { View, StyleSheet } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import Button from "./Button";
import Input from "./Input";

interface InputValues {
  title: string;
  rating: string;
  description: string;
}

const MAX_RATING = 5;

export default function AddReviewSheet(props: any) {
  const [values, setValues] = useState<InputValues>({
    title: "",
    rating: "",
    description: "",
  });

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

  const handleSubmit = () => {
    console.log("submitting: ", values);
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
        <Button title="Submit Review" onPress={handleSubmit} />
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
