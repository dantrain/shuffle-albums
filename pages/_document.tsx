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
import { appleDeviceSpecsForLaunchImages } from "pwa-asset-generator";
import { Fragment } from "react";

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
          <meta name="theme-color" content="#ffffff" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black" />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:url" content="https://www.shufflealbums.com" />
          <meta name="twitter:title" content="Shuffle Albums" />
          <meta
            name="twitter:description"
            content="Shuffle your liked albums on Spotify"
          />
          <meta
            name="twitter:image"
            content="https://www.shufflealbums.com/manifest-icon-192.maskable.png"
          />
          <meta name="twitter:creator" content="@danhappysalad" />

          <meta property="og:type" content="website" />
          <meta property="og:title" content="Shuffle Albums" />
          <meta
            property="og:description"
            content="Shuffle your liked albums on Spotify"
          />
          <meta property="og:site_name" content="Shuffle Albums" />
          <meta property="og:url" content="https://www.shufflealbums.com" />
          <meta
            property="og:image"
            content="https://www.shufflealbums.com/apple-touch-icon.png"
          />

          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
          <link rel="manifest" href="/manifest.json" />
          {appleDeviceSpecsForLaunchImages.map((spec, i) => {
            return (
              <Fragment key={i}>
                <link
                  key={`apple-splash-${spec.portrait.width}-${spec.portrait.height}`}
                  rel="apple-touch-startup-image"
                  href={`apple-splash-${spec.portrait.width}-${spec.portrait.height}.png`}
                  media={`(device-width: ${
                    spec.portrait.width / spec.scaleFactor
                  }px) and (device-height: ${
                    spec.portrait.height / spec.scaleFactor
                  }px) and (-webkit-device-pixel-ratio: ${
                    spec.scaleFactor
                  }) and (orientation: portrait)`}
                />
                <link
                  key={`apple-splash-${spec.portrait.width}-${spec.portrait.height}`}
                  rel="apple-touch-startup-image"
                  href={`apple-splash-${spec.portrait.width}-${spec.portrait.height}.png`}
                  media={`(device-width: ${
                    spec.portrait.height / spec.scaleFactor
                  }px) and (device-height: ${
                    spec.portrait.width / spec.scaleFactor
                  }px) and (-webkit-device-pixel-ratio: ${
                    spec.scaleFactor
                  }) and (orientation: landscape)`}
                />
              </Fragment>
            );
          })}
          <style
            data-emotion-css={this.props.ids.join(" ")}
            dangerouslySetInnerHTML={{ __html: this.props.css }}
          />
        </Head>
        <body tw="fixed overflow-x-hidden text-white sm:static bg-background min-h-screen">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
