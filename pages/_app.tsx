import type { AppProps } from "next/app";
import Head from "next/head";
import { GlobalStyles } from "twin.macro";

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title>Shuffle Albums</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, viewport-fit=cover"
      />
    </Head>
    <GlobalStyles />
    <Component {...pageProps} />
  </>
);

export default App;
