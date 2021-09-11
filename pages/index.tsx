import { range, shuffle } from "lodash-es";
import type { NextPage } from "next";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Transition, TransitionGroup } from "react-transition-group";
import useSWR from "swr";
import tw, { css } from "twin.macro";
import AlbumArt from "../components/AlbumArt";
import Button from "../components/Button";
import Suspense from "../components/Suspense";
import fetcher from "../utils/fetcher";

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

  const offset = getOffset(shuffledOffsets, index);

  return shuffledOffsets.length ? (
    <>
      <div tw="relative mx-auto text-center" css="max-width: 640px">
        <TransitionGroup>
          <Transition key={offset} timeout={{ exit: 200 }}>
            {(state) => <Album offset={offset} state={state} />}
          </Transition>
        </TransitionGroup>
      </div>
      <div tw="flex justify-center">
        <Button onClick={handleShuffle}>Shuffle</Button>
      </div>
      <div tw="sr-only">
        <Suspense fallback={<></>}>
          {range(4).map((rangeIndex) => (
            <Album
              key={rangeIndex}
              offset={getOffset(shuffledOffsets, index + rangeIndex + 1)}
              hidden
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
  hidden,
  state,
}: {
  offset: number;
  hidden?: boolean;
  state?: string;
}) => {
  const { album } = useAlbum(offset);
  const image = album.images[0];

  return (
    <>
      <div
        css={[
          tw`mb-8 transition duration-200`,
          state === "exiting" && [
            tw`absolute top-0 w-full opacity-0 ease-in-quad`,
            css`
              transform: translateY(-200%) translateX(${(offset % 20) - 10}%);
              rotate(${(offset % 20) - 10}deg);
            `,
          ],
          state === "entering" &&
            tw`transform scale-95 ease-out-cubic opacity-30`,
        ]}
      >
        <AlbumArt
          href={album.uri}
          src={image.url}
          alt={album.name}
          disableFocus={hidden}
        />
      </div>
      {hidden || state === "exiting" ? null : (
        <>
          <p tw="mb-2 text-2xl font-bold line-clamp-1">
            <a href={album.uri} tabIndex={hidden ? -1 : undefined}>
              {album.name}
            </a>
          </p>
          <p tw="text-lg text-gray-400 mb-11 line-clamp-1">
            {album.artists
              .map(({ name, uri }) => (
                <a key={uri} href={uri} tabIndex={hidden ? -1 : undefined}>
                  {name}
                </a>
              ))
              .reduce(
                (acc, curr) => (acc.length ? [...acc, ", ", curr] : [curr]),
                [] as ReactNode[]
              )}
          </p>
        </>
      )}
    </>
  );
};

const Home: NextPage = () => {
  return (
    <main tw="relative sm:mt-20">
      <ErrorBoundary fallbackRender={({ error }) => <pre>{error.message}</pre>}>
        <Suspense fallback={<></>}>
          <AlbumShuffler />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
};

export default Home;
