import { extractCritical } from "@emotion/server";
import { EmotionCritical } from "@emotion/server/types/create-instance";
import { RenderPageResult } from "next/dist/shared/lib/utils";
import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";

type CustomDocumentProps = DocumentInitialProps &
  RenderPageResult &
  EmotionCritical;

class CustomDocument extends Document<CustomDocumentProps> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const page = await ctx.renderPage();
    const styles = extractCritical(page.html);
    return { ...initialProps, ...page, ...styles };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta
            name="description"
            content="Shuffle your liked albums on Spotify"
          />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
          <link rel="manifest" href="/manifest.webmanifest" />
          <style
            data-emotion-css={this.props.ids.join(" ")}
            dangerouslySetInnerHTML={{ __html: this.props.css }}
          />
        </Head>
        <body tw="fixed p-6 overflow-x-hidden text-white sm:static bg-background">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
