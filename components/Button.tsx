import { ComponentPropsWithoutRef } from "react";

const Button = (props: ComponentPropsWithoutRef<"button">) => (
  <button
    tw="block px-8 py-3.5 text-sm font-bold tracking-widest text-white uppercase rounded-full bg-spotify-green focus:outline-none focus-visible:ring focus-visible:ring-white focus-visible:ring-offset-3 focus-visible:ring-offset-background hover:transform hover:scale-104 active:scale-100 antialiased"
    {...props}
  />
);

export default Button;
