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

const EXIT_DURATION = 200;

const AlbumShuffler = () => {
  const { total } = useAlbumsCount();
  const [shuffledOffsets, setShuffledOffsets] = useState<number[]>([]);
  const [index, setIndex] = useState(0);
  const [transitionKey, setTransitionKey] = useState(0);
  const queueRef = useRef<Array<"forward" | "backward">>([]);
  const isProcessingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (total) {
      setShuffledOffsets(shuffle(range(total)));
      setIndex(0);
    }
  }, [total]);

  // Safety net: detect stacking and force remount if needed
  const checkForStacking = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const albums = container.querySelectorAll("[data-album]");
    // After debounce delay, exits should be complete - only 1 album expected
    if (albums.length > 1) {
      setTransitionKey((k) => k + 1);
      isProcessingRef.current = false;
      queueRef.current = [];
    }
  }, []);

  const processQueue = useCallback(() => {
    if (isProcessingRef.current || queueRef.current.length === 0) return;

    isProcessingRef.current = true;
    const action = queueRef.current.shift()!;

    if (action === "forward") {
      setIndex((index) => index + 1);
    } else {
      setIndex((index) => Math.max(0, index - 1));
    }
  }, []);

  const handleExited = useCallback(() => {
    isProcessingRef.current = false;
    processQueue();
  }, [processQueue]);

  // Debounced check for stacking after activity settles
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const debouncedCheckForStacking = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      checkForStacking();
    }, EXIT_DURATION + 50);
  }, [checkForStacking]);

  const handleForward = useCallback(() => {
    // Limit queue to 1 pending action to prevent stacking
    if (queueRef.current.length === 0) {
      queueRef.current.push("forward");
    } else {
      queueRef.current[0] = "forward";
    }
    processQueue();
    debouncedCheckForStacking();
  }, [processQueue, debouncedCheckForStacking]);

  const handleBackward = useCallback(() => {
    // Limit queue to 1 pending action to prevent stacking
    if (queueRef.current.length === 0) {
      queueRef.current.push("backward");
    } else {
      queueRef.current[0] = "backward";
    }
    processQueue();
    debouncedCheckForStacking();
  }, [processQueue, debouncedCheckForStacking]);

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
        <div
          ref={containerRef}
          className="overflow-hidden"
          style={{
            maxHeight:
              "calc(clamp(25rem, calc(100vh - 25rem), 640px) + 8.25rem)",
          }}
        >
          <TransitionGroup key={transitionKey}>
            <Transition
              key={offset}
              timeout={{ exit: EXIT_DURATION }}
              onExited={handleExited}
            >
              {(state) => <Album offset={offset} state={state} />}
            </Transition>
          </TransitionGroup>
        </div>
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
      <div data-album className={getClassName()} style={getStyle()}>
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
