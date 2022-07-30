import { useEffect, useState } from "react";
import { Movie } from "../models/Movie";
import { Connection } from "@solana/web3.js";
import { MovieCoordinator } from "./MovieCoordinator";
import { FlatList, View, Text, StyleSheet } from "react-native";
import Input from "./Input";
import { COLORS } from "../constants";
import { usePrevious } from "../utils/usePrevious";

interface MovieListProps {
  connection: Connection;
}

export default function MovieList({ connection }: MovieListProps) {
  const [movies, setMovies] = useState<(Movie | null)[]>([]);
  const [userInput, setUserInput] = useState({
    page: 1,
    search: "",
  });

  const previousUserInput = usePrevious(userInput);

  useEffect(() => {
    const { page, search } = userInput;

    let shouldReload = false;
    if (
      typeof previousUserInput?.search != "undefined" &&
      previousUserInput.search !== search
    ) {
      shouldReload = true;
    }

    MovieCoordinator.fetchPage(connection, page, 10, search, shouldReload).then(
      (fetchedMovies) => {
        console.log(
          `fetch complete, received ${fetchedMovies.length} new movies`
        );
        shouldReload
          ? setMovies(fetchedMovies)
          : setMovies((movies) => [...movies, ...fetchedMovies]);
      }
    );
  }, [userInput]);

  const handleScroll = () =>
    movies.length < 10
      ? null
      : setUserInput((prev) => ({ page: prev.page + 1, search: prev.search }));

  const handleSearch = (text: string) =>
    setUserInput((prev) => ({ page: 1, search: text }));

  return (
    <View style={{ flexGrow: 1 }}>
      <Input
        value={userInput.search}
        placeholder="Search movies..."
        onChangeText={handleSearch}
      />
      <FlatList
        ItemSeparatorComponent={() => <View style={{ marginTop: 20 }} />}
        data={movies}
        onEndReached={handleScroll}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <View style={styles.item} key={index}>
            <View style={styles.itemHeader}>
              <Text ellipsizeMode="tail" numberOfLines={1} style={styles.title}>
                {item?.title}
              </Text>
              <Text style={styles.rating}>{item?.rating}/5</Text>
            </View>
            <Text
              ellipsizeMode="tail"
              numberOfLines={2}
              style={styles.description}
            >
              {item?.description}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  description: {
    color: COLORS.LIGHT_GREY,
    fontSize: 14,
  },
  item: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: COLORS.GREY,
    borderRadius: 6,
    height: 80,
    width: "95%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  list: {
    minWidth: "100%",
    flexDirection: "column",
  },
  rating: {
    color: COLORS.WHITE,
    fontWeight: "500",
    fontSize: 14,
  },
  title: {
    color: COLORS.WHITE,
    fontWeight: "600",
    fontSize: 16,
  },
});
