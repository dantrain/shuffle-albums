import { range, shuffle } from "lodash-es";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, {
  ReactNode,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useHotkeys } from "react-hotkeys-hook";
import { useSwipeable } from "react-swipeable";
import { Transition, TransitionGroup } from "react-transition-group";
import useSWR from "swr/immutable";
import { useReadLocalStorage } from "usehooks-ts";
import AlbumArt from "../components/AlbumArt";
import Button from "../components/Button";
import ClientOnlySuspense from "../components/ClientOnlySuspense";
import Logo from "../components/Logo";
import Progress from "../components/Progress";
import SettingsMenu from "../components/SettingsMenu";
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

  const handleForward = useCallback(() => {
    setIndex((index) => index + 1);
  }, []);

  const handleBackward = useCallback(() => {
    setIndex((index) => Math.max(0, index - 1));
  }, []);

  useHotkeys("right", handleForward);
  useHotkeys("left", handleBackward);

  const swipeHandlers = useSwipeable({
    onSwipedUp: handleForward,
    onSwipedDown: handleBackward,
  });

  const offset = getOffset(shuffledOffsets, index);

  return shuffledOffsets.length ? (
    <>
      <div
        className="relative mx-auto text-center"
        style={{ maxWidth: "clamp(25rem, calc(100vh - 25rem), 640px)" }}
        {...swipeHandlers}
      >
        <TransitionGroup>
          <Transition key={offset} timeout={{ exit: 200 }}>
            {(state) => <Album offset={offset} state={state} />}
          </Transition>
        </TransitionGroup>
      </div>
      <div className="flex justify-center">
        <Button onClick={handleForward}>Shuffle</Button>
      </div>
      <div className="sr-only">
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
        external_urls: {
          spotify: string;
        };
        artists: {
          name: string;
          uri: string;
          external_urls: {
            spotify: string;
          };
        }[];
        images: { url: string; width: number; height: number }[];
      };
    }[];
  }>(`/me/albums?limit=1&offset=${offset}`, fetcher, {
    suspense: true,
    dedupingInterval: 3600000,
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
  const useWebPlayer = useReadLocalStorage("useWebPlayer");

  const getClassName = () => {
    const base = "mb-8 transition duration-200 aspect-square overflow-clip";
    if (state === "exiting") {
      return `${base} absolute top-0 w-full opacity-0 ease-[cubic-bezier(0.55,0.055,0.675,0.19)]`;
    }
    if (state === "entering") {
      return `${base} scale-95 opacity-30`;
    }
    return `${base} ease-[cubic-bezier(0.215,0.61,0.355,1)]`;
  };

  const getStyle = (): React.CSSProperties | undefined => {
    if (state === "exiting") {
      return {
        transform: `translateY(-200%) translateX(${(offset % 20) - 10}%) rotate(${(offset % 20) - 10}deg)`,
      };
    }
    return undefined;
  };

  return (
    <>
      <div className={getClassName()} style={getStyle()}>
        <AlbumArt
          href={useWebPlayer ? album.external_urls.spotify : album.uri}
          src={image.url}
          alt={album.name}
          disableFocus={hidden || state === "exiting"}
        />
      </div>
      {hidden || state === "exiting" ? null : (
        <>
          <p className="mb-2 text-2xl font-bold line-clamp-1 h-8">
            <a
              href={useWebPlayer ? album.external_urls.spotify : album.uri}
              target={useWebPlayer ? "_blank" : undefined}
              rel="noreferrer"
            >
              {album.name}
            </a>
          </p>
          <p className="text-lg text-gray-400 mb-8 line-clamp-1 h-7">
            {album.artists
              .map((artist) => (
                <a
                  key={artist.uri}
                  href={
                    useWebPlayer ? artist.external_urls.spotify : artist.uri
                  }
                  target={useWebPlayer ? "_blank" : undefined}
                  rel="noreferrer"
                >
                  {artist.name}
                </a>
              ))
              .reduce(
                (acc, curr) => (acc.length ? [...acc, ", ", curr] : [curr]),
                [] as ReactNode[],
              )}
          </p>
        </>
      )}
    </>
  );
};

const Error = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  });

  return null;
};

const Home: NextPage = () => {
  return (
    <main className="relative p-6 sm:py-24 w-screen">
      <Progress />
      <ErrorBoundary FallbackComponent={Error}>
        <Logo />
        <ClientOnlySuspense fallback={<></>}>
          <AlbumShuffler />
        </ClientOnlySuspense>
        <SettingsMenu />
      </ErrorBoundary>
    </main>
  );
};

export default Home;
