import { range, shuffle } from "lodash-es";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import Button from "../components/Button";
import fetcher from "../utils/fetcher";
import Suspense from "../components/Suspense";
import { ErrorBoundary } from "react-error-boundary";
import AlbumArt from "../components/AlbumArt";

const useAlbumsCount = () => {
  const { data } = useSWR<{ total: number }>("/me/albums?limit=1", fetcher, {
    suspense: true,
  });

  return { total: data?.total };
};

const getOffset = (shuffledOffsets: number[], index: number) =>
  shuffledOffsets[index % shuffledOffsets.length];

const AlbumShuffler = () => {
  const { total } = useAlbumsCount();
  const [shuffledOffsets, setShuffledOffsets] = useState<number[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (total) {
      setShuffledOffsets(shuffle(range(total)));
      setIndex(0);
    }
  }, [total]);

  const handleShuffle = useCallback(() => {
    setIndex((index) => index + 1);
  }, []);

  return shuffledOffsets.length ? (
    <>
      <Album
        offset={getOffset(shuffledOffsets, index)}
        onShuffle={handleShuffle}
      />
      <div tw="sr-only">
        <Suspense fallback={<></>}>
          {range(4).map((rangeIndex) => (
            <Album
              key={rangeIndex}
              offset={getOffset(shuffledOffsets, index + rangeIndex + 1)}
              onShuffle={handleShuffle}
            />
          ))}
        </Suspense>
      </div>
    </>
  ) : null;
};

const useAlbum = (offset: number) => {
  const { data } = useSWR<{
    items: {
      album: {
        id: string;
        name: string;
        uri: string;
        artists: { name: string; uri: string }[];
        images: { url: string; width: number; height: number }[];
      };
    }[];
  }>(`/me/albums?limit=1&offset=${offset}`, fetcher, {
    suspense: true,
    dedupingInterval: 3600000,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return { album: data?.items[0].album! };
};

const Album = ({
  offset,
  onShuffle: shuffle,
}: {
  offset: number;
  onShuffle: () => void;
}) => {
  const { album } = useAlbum(offset);
  const image = album.images[0];

  return (
    <div tw="text-center">
      <AlbumArt href={album.uri} src={image.url} alt={album.name} />
      <p tw="mb-2 text-2xl font-bold">
        <a href={album.uri}>{album.name}</a>
      </p>
      <p tw="text-lg text-gray-400 mb-11">
        <a href={album.artists[0].uri}>{album.artists[0].name}</a>
      </p>
      <div tw="flex justify-center mb-20">
        <Button onClick={shuffle}>Shuffle</Button>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Spotify Albums</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main tw="mt-20">
        <ErrorBoundary
          fallbackRender={({ error }) => <pre>{error.message}</pre>}
        >
          <Suspense fallback={<></>}>
            <AlbumShuffler />
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default Home;
