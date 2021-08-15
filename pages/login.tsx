import type { NextPage } from "next";
import "twin.macro";
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
    <button onClick={handleLogin} tw="px-5 py-1 text-white bg-black rounded-md">
      Login with Spotify
    </button>
  );
};

export default Login;
