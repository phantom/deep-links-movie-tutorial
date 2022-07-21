import { Connection, PublicKey } from "@solana/web3.js";
import { Movie } from "../models/Movie";
import bs58 from "bs58";
import { MOVIE_REVIEW_PROGRAM_ID } from "../constants";

export class MovieCoordinator {
  static accounts: PublicKey[] = [];

  static async prefetchAccounts(connection: Connection, search: string) {
    const accounts = await connection.getProgramAccounts(
      MOVIE_REVIEW_PROGRAM_ID,
      {
        dataSlice: { offset: 2, length: 18 }, // title begins at the second byte and can run for an arbitrary length. we cap that length at 18 for the sake of comparisons
        filters:
          search === ""
            ? []
            : [
                {
                  memcmp: {
                    offset: 6,
                    bytes: bs58.encode(Buffer.from(search)),
                  },
                },
              ],
      }
    );

    // sort titles alphabetically
    accounts.sort((a, b) => {
      const lengthA = a.account.data.readUInt32LE(0); // get title length of movie A
      const lengthB = b.account.data.readUInt32LE(0); // get title length of movie B
      const dataA = a.account.data.slice(4, 4 + lengthA); // get actual title of movie A
      const dataB = b.account.data.slice(4, 4 + lengthB); // get actual title of movie B
      return dataA.compare(dataB);
    });

    this.accounts = accounts.map((account) => account.pubkey);
  }

  static async fetchPage(
    connection: Connection,
    page: number,
    perPage: number,
    search: string,
    reload: boolean = false
  ): Promise<Movie[]> {
    if (this.accounts.length === 0 || reload) {
      await this.prefetchAccounts(connection, search);
    }

    const paginatedPublicKeys = this.accounts.slice(
      (page - 1) * perPage,
      page * perPage
    );
    if (paginatedPublicKeys.length === 0) {
      return [];
    }

    const accounts = await connection.getMultipleAccountsInfo(
      paginatedPublicKeys
    );

    return accounts.reduce((accum: Movie[], account) => {
      const movie = Movie.deserialize(account?.data);
      return movie ? [...accum, movie] : accum;
    }, []);
  }
}
