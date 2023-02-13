import { useNProgress } from "@tanem/react-nprogress";
import PubSub from "pubsub-js";
import { useEffect, useState } from "react";

const Progress = () => {
  const [inFlight, setInFlight] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const token = PubSub.subscribe("REQUEST", (msg, data) => {
      if (data === "REQUEST_START") setInFlight((state) => state + 1);
      if (data === "REQUEST_END")
        timeout = setTimeout(
          () => setInFlight((state) => Math.max(0, state - 1)),
          50
        );
    });

    return () => {
      PubSub.unsubscribe(token);
      clearTimeout(timeout);
    };
  }, []);

  const isLoading = inFlight > 0;

  const [isAnimating, setIsAnimating] = useState(false);
  const [maxProgress, setMaxProgress] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isLoading) {
      setMaxProgress(0);

      timeout = setTimeout(() => {
        setIsAnimating(true);
        setMaxProgress(1);
      }, 500);
    } else {
      setIsAnimating(false);
    }

    return () => clearTimeout(timeout);
  }, [isLoading]);

  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating,
  });

  return (
    <div
      tw="pointer-events-none absolute top-0 inset-x-0 h-1 overflow-hidden"
      style={{
        opacity: isFinished ? 0 : 1,
        transition: `opacity ${animationDuration}ms linear`,
      }}
    >
      <div
        tw="absolute left-0 z-50 h-[2px] w-full"
        style={{
          marginLeft: `${(-1 + Math.min(maxProgress, progress)) * 100}%`,
          transition: `margin-left ${animationDuration}ms linear`,
        }}
      >
        <div
          tw="absolute right-0 h-full w-28 translate-y-[-4px] translate-x-[1px] rotate-3 bg-spotify-green"
          style={{ boxShadow: "0 0 10px #1eb854, 0 0 5px #1eb854" }}
        />
        <div tw="relative z-10 h-full w-full bg-spotify-green"></div>
      </div>
    </div>
  );
};

export default Progress;
