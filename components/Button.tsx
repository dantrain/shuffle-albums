import {
  forwardRef,
  ComponentPropsWithoutRef,
  ReactNode,
  Ref,
  useState,
} from "react";
import Link from "next/link";
import { usePress, useFocus, mergeProps } from "react-aria";

type ButtonBaseProps = {
  children?: ReactNode;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof ButtonBaseProps> & {
    as?: "button";
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof ButtonBaseProps> & {
    as: typeof Link;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const baseClassName =
  "cursor-pointer block px-8 py-3.5 text-sm font-bold tracking-widest text-white uppercase rounded-full bg-spotify-green outline-none [@media(hover:hover)]:hover:scale-104 [@media(hover:hover)]:active:scale-100 antialiased select-none";

const focusRingClassName =
  "ring ring-white ring-offset-3 ring-offset-background";

// Track if Tab was pressed recently (for focus-visible detection)
let hadKeyboardEvent = false;

if (typeof window !== "undefined") {
  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Tab") {
        hadKeyboardEvent = true;
      }
    },
    true,
  );

  document.addEventListener(
    "mousedown",
    () => {
      hadKeyboardEvent = false;
    },
    true,
  );

  document.addEventListener(
    "pointerdown",
    () => {
      hadKeyboardEvent = false;
    },
    true,
  );
}

const Button = forwardRef(function Button(
  props: ButtonProps,
  ref: Ref<HTMLButtonElement | HTMLAnchorElement>,
) {
  const [pointerType, setPointerType] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  const { pressProps, isPressed } = usePress({
    onPressStart: (e) => setPointerType(e.pointerType),
    onPressEnd: () => setPointerType(""),
  });

  const { focusProps } = useFocus({
    onFocus: () => {
      setIsFocused(true);
      setIsFocusVisible(hadKeyboardEvent);
    },
    onBlur: () => {
      setIsFocused(false);
      setIsFocusVisible(false);
    },
  });

  const keyboardProps = {
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        setIsFocusVisible(true);
      }
    },
  };

  // Only scale down for touch/keyboard, not mouse (mouse uses CSS hover→active)
  const showScaleDown = isPressed && pointerType !== "mouse";

  const className = `${baseClassName} ${showScaleDown ? "scale-95!" : ""} ${isFocusVisible ? focusRingClassName : ""}`;

  if (props.as === Link) {
    const { as: _, ...linkProps } = props as ButtonAsLink;
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={className}
        {...mergeProps(pressProps, focusProps, keyboardProps, linkProps)}
      />
    );
  }

  const { as: _, ...buttonProps } = props as ButtonAsButton;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={className}
      {...mergeProps(pressProps, focusProps, keyboardProps, buttonProps)}
    />
  );
});

export default Button;
