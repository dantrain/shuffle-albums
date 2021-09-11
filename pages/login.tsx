import type { NextPage } from "next";
import Button from "../components/Button";
import { generateRandomString, pkceChallengeFromVerifier } from "../utils/auth";

const Login: NextPage = () => {
  const handleLogin = async () => {
    const state = generateRandomString();
    localStorage.setItem("pkce_state", state);

    const codeVerifier = generateRandomString();
    localStorage.setItem("pkce_code_verifier", codeVerifier);

    const codeChallenge = await pkceChallengeFromVerifier(codeVerifier);

    const redirectUri = encodeURIComponent(
      `${window.location.origin}/logincallback`
    );

    const url = `https://accounts.spotify.com/authorize?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&code_challenge_method=S256&code_challenge=${codeChallenge}&state=${state}&scope=user-library-read`;

    window.location.href = url;
  };

  return (
    <main tw="mt-16 text-center sm:mt-48">
      <h1 tw="font-black tracking-tight text-7xl mb-28 sm:text-8xl">
        Shuffle Albums
      </h1>
      <div tw="flex justify-center">
        <Button onClick={handleLogin}>Login with Spotify</Button>
      </div>
    </main>
  );
};

export default Login;
