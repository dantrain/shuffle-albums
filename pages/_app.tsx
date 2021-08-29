import type { AppProps } from "next/app";
import { GlobalStyles } from "twin.macro";
import Head from "next/head";

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title>Spotify Albums</title>
    </Head>
    <GlobalStyles />
    <Component {...pageProps} />
  </>
);

export default App;
