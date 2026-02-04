import { useNProgress } from "@tanem/react-nprogress";
import PubSub from "pubsub-js";
import { useEffect, useRef, useState } from "react";

const Progress = () => {
  const [inFlight, setInFlight] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const token = PubSub.subscribe("REQUEST", (msg, data) => {
      if (data === "REQUEST_START") setInFlight((state) => state + 1);
      if (data === "REQUEST_END")
        timeout = setTimeout(
          () => setInFlight((state) => Math.max(0, state - 1)),
          50,
        );
    });

    return () => {
      PubSub.unsubscribe(token);
      clearTimeout(timeout);
    };
  }, []);

  const isLoading = inFlight > 0;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [animationState, setAnimationState] = useState({
    isAnimating: false,
    maxProgress: 0,
  });

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (isLoading) {
      setAnimationState({ isAnimating: false, maxProgress: 0 });
      timeoutRef.current = setTimeout(() => {
        setAnimationState({ isAnimating: true, maxProgress: 1 });
      }, 2000);
    } else {
      setAnimationState((prev) => ({ ...prev, isAnimating: false }));
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLoading]);

  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating: animationState.isAnimating,
  });

  return (
    <div
      className="pointer-events-none absolute top-0 inset-x-0 h-1 overflow-hidden"
      style={{
        opacity: isFinished ? 0 : 1,
        transition: `opacity ${animationDuration}ms linear`,
      }}
    >
      <div
        className="absolute left-0 z-50 h-[2px] w-full"
        style={{
          marginLeft: `${(-1 + Math.min(animationState.maxProgress, progress)) * 100}%`,
          transition: `margin-left ${animationDuration}ms linear`,
        }}
      >
        <div
          className="absolute right-0 h-full w-28 translate-y-[-4px] translate-x-[1px] rotate-3 bg-spotify-green"
          style={{ boxShadow: "0 0 10px #1eb854, 0 0 5px #1eb854" }}
        />
        <div className="relative z-10 h-full w-full bg-spotify-green"></div>
      </div>
    </div>
  );
};

export default Progress;
