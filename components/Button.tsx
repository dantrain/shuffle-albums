import {
  forwardRef,
  ComponentPropsWithoutRef,
  ReactNode,
  Ref,
  useState,
} from "react";
import Link from "next/link";
import { usePress, mergeProps } from "react-aria";

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
  "cursor-pointer block px-8 py-3.5 text-sm font-bold tracking-widest text-white uppercase rounded-full bg-spotify-green focus:outline-none focus-visible:ring focus-visible:ring-white focus-visible:ring-offset-3 focus-visible:ring-offset-background [@media(hover:hover)]:hover:scale-104 [@media(hover:hover)]:active:scale-100 antialiased select-none";

const Button = forwardRef(function Button(
  props: ButtonProps,
  ref: Ref<HTMLButtonElement | HTMLAnchorElement>,
) {
  const [pointerType, setPointerType] = useState("");

  const { pressProps, isPressed } = usePress({
    onPressStart: (e) => setPointerType(e.pointerType),
    onPressEnd: () => setPointerType(""),
  });

  // Only scale down for touch/keyboard, not mouse (mouse uses CSS hover→active)
  const showScaleDown = isPressed && pointerType !== "mouse";

  const className = `${baseClassName} ${showScaleDown ? "scale-95!" : ""}`;

  if (props.as === Link) {
    const { as: _, ...linkProps } = props as ButtonAsLink;
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={className}
        {...mergeProps(pressProps, linkProps)}
      />
    );
  }

  const { as: _, ...buttonProps } = props as ButtonAsButton;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={className}
      {...mergeProps(pressProps, buttonProps)}
    />
  );
});

export default Button;
