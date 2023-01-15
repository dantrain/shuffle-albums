import { NextPage } from "next";
import Link from "next/link";
import Button from "../components/Button";
import Spacer from "../components/Spacer";

const Privacy: NextPage = () => {
  return (
    <main tw="text-center p-6 flex flex-col min-h-screen">
      <Spacer />
      <div tw="mx-auto max-w-2xl">
        <h1 tw="font-black tracking-tight text-5xl mb-14">Privacy Policy</h1>
        <p tw="sm:text-lg text-left mb-14">
          The data that you authorise this app to access from your Spotify
          account in order to function is not recorded and does not leave your
          device. This app uses no third-party analytics or advertising
          frameworks and collects no information on you.
        </p>
        <div tw="flex justify-center">
          <Button as={Link} href="/">
            Home
          </Button>
        </div>
      </div>
      <Spacer factor={3} />
    </main>
  );
};

export default Privacy;
