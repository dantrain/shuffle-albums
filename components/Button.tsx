import { forwardRef, ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";

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

const buttonClassName =
  "cursor-pointer block px-8 py-3.5 text-sm font-bold tracking-widest text-white uppercase rounded-full bg-spotify-green focus:outline-none focus-visible:ring focus-visible:ring-white focus-visible:ring-offset-3 focus-visible:ring-offset-background [@media(hover:hover)]:hover:scale-104 [@media(hover:hover)]:active:scale-100 [@media(hover:hover)]:focus-visible:active:scale-95 [@media(hover:none)]:active:scale-95 antialiased";

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (props, ref) => {
    if (props.as === Link) {
      const { as: _, ...linkProps } = props as ButtonAsLink;
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={buttonClassName}
          {...linkProps}
        />
      );
    }

    const { as: _, ...buttonProps } = props as ButtonAsButton;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={buttonClassName}
        {...buttonProps}
      />
    );
  },
);

Button.displayName = "Button";

export default Button;
