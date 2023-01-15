import { ElementType, forwardRef, ReactElement } from "react";
import { Box, PolymorphicComponentProps } from "react-polymorphic-box";

const defaultElement = "button";

const Button: (<E extends ElementType = typeof defaultElement>(
  props: PolymorphicComponentProps<E, {}>
) => ReactElement | null) & { displayName?: string } = forwardRef(
  <E extends ElementType = typeof defaultElement>(
    props: PolymorphicComponentProps<E, {}>,
    ref: typeof props.ref
  ) => (
    <Box
      as={defaultElement}
      ref={ref}
      tw="block px-8 py-3.5 text-sm font-bold tracking-widest text-white uppercase rounded-full bg-spotify-green focus:outline-none focus-visible:ring focus-visible:ring-white focus-visible:ring-offset-3 focus-visible:ring-offset-background hover:scale-104 active:scale-100 antialiased"
      {...props}
    />
  )
);

Button.displayName = "Button";

export default Button;
