import { useEffect, useState } from "react";
import { Movie } from "../models/Movie";
import { Connection } from "@solana/web3.js";
import { MovieCoordinator } from "./MovieCoordinator";
import { FlatList, View, Text, StyleSheet } from "react-native";
import Input from "./Input";
import { COLORS } from "../constants";

interface MovieListProps {
  connection: Connection;
}

export default function MovieList({ connection }: MovieListProps) {
  const [movies, setMovies] = useState<(Movie | null)[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    console.log("search: ", search);
    // console.log("page: ", page);
    MovieCoordinator.fetchPage(
      connection,
      movies.length > 0 ? movies.length / 10 : 1,
      10,
      search,
      search !== ""
    ).then((fetchedMovies) => {
      console.log("received " + fetchedMovies.length + " movies");
      search
        ? setMovies(fetchedMovies)
        : setMovies((movies) => [...movies, ...fetchedMovies]);
      // setMovies(fetchedMovies);
    });
  }, [search, page]);

  // useEffect(() => {
  //   console.log("fetch movies search");
  //   MovieCoordinator.fetchPage(connection, 1, 10, search, search !== "").then(
  //     (fetchedMovies) => {
  //       console.log("received " + fetchedMovies.length + " movies from search");
  //       setMovies(fetchedMovies);
  //     }
  //   );
  // }, [search]);

  // useEffect(() => {
  //   console.log("fetch movies scroll");
  //   MovieCoordinator.fetchPage(connection, page, 10, "", false).then(
  //     (fetchedMovies) => {
  //       console.log("received " + fetchedMovies.length + " movies from scroll");
  //       setMovies((movies) => [...movies, ...fetchedMovies]);
  //     }
  //   );
  // }, [page]);

  return (
    <View style={{ flexGrow: 1 }}>
      <Input
        value={search}
        placeholder="Search movies..."
        onChangeText={setSearch}
      />
      <FlatList
        ItemSeparatorComponent={() => <View style={{ marginTop: 20 }} />}
        data={movies}
        onEndReached={() => setPage(page + 1)}
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
