import { ComponentPropsWithoutRef } from "react";

const Button = (props: ComponentPropsWithoutRef<"button">) => (
  <button
    tw="block px-8 py-3 font-bold tracking-widest text-white uppercase rounded-full bg-spotify-green focus:outline-none"
    {...props}
  />
);

export default Button;
