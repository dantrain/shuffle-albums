import { NextPage } from "next";

const Privacy: NextPage = () => {
  return (
    <main tw="mt-16 text-center sm:mt-48">
      <div tw="mx-auto max-w-2xl">
        <h1 tw="font-black tracking-tight text-5xl mb-14">Privacy Policy</h1>
        <p tw="text-lg text-left">
          The data that you authorise this app to access from your Spotify
          account in order to function is not recorded and does not leave your
          device. This app uses no third-party analytics or advertising
          frameworks and collects no information on you.
        </p>
      </div>
    </main>
  );
};

export default Privacy;
