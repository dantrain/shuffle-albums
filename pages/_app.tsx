import type { AppProps } from "next/app";
import { GlobalStyles } from "twin.macro";

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <GlobalStyles />
    <Component {...pageProps} />
  </>
);

export default App;
