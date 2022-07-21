import { FC, useEffect, useState } from "react";
import { Movie } from "../models/Movie";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { MovieCoordinator } from "./MovieCoordinator";
import { FlatList, TouchableHighlight, View, Text } from "react-native";

export const MovieList: FC = () => {
  const [movies, setMovies] = useState<(Movie | null)[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const connection = new Connection(clusterApiUrl("devnet"));
    MovieCoordinator.fetchPage(
      connection,
      page,
      10,
      search,
      search !== ""
    ).then((fetchedMovies) => {
      setMovies((movies) => [...movies, ...fetchedMovies]);
    });
  }, [page, search]);

  return (
    <FlatList
      ItemSeparatorComponent={() => <View style={{ marginTop: 20 }} />}
      data={movies}
      onEndReached={() => setPage(page + 1)}
      renderItem={({ item, index, separators }) => (
        <TouchableHighlight
          key={index}
          //   onPress={(event) => console.log(event.target)}
          onShowUnderlay={separators.highlight}
          onHideUnderlay={separators.unhighlight}
        >
          <View style={{ backgroundColor: "white" }}>
            <Text>{item?.title}</Text>
            <Text>{item?.rating}/5</Text>
            <Text>{item?.description}</Text>
          </View>
        </TouchableHighlight>
      )}
    />
  );
};
