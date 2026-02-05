"use client";

import Link from "next/link";
import Button from "../../components/Button";
import Spacer from "../../components/Spacer";
import {
  generateRandomString,
  pkceChallengeFromVerifier,
} from "../../utils/auth";

export default function Login() {
  const handleLogin = async () => {
    const state = generateRandomString();
    localStorage.setItem("pkce_state", state);

    const codeVerifier = generateRandomString();
    localStorage.setItem("pkce_code_verifier", codeVerifier);

    const codeChallenge = await pkceChallengeFromVerifier(codeVerifier);

    const redirectUri = encodeURIComponent(
      `${window.location.origin}/logincallback`,
    );

    const url = `https://accounts.spotify.com/authorize?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&code_challenge_method=S256&code_challenge=${codeChallenge}&state=${state}&scope=user-library-read`;

    window.location.href = url;
  };

  return (
    <main className="text-center p-6 flex flex-col min-h-[80vh] sm:min-h-screen">
      <Spacer factor={10} />
      <h1 className="font-black tracking-tight text-7xl sm:text-8xl">
        Shuffle Albums
      </h1>
      <Spacer factor={0} />
      <p className="text-gray-400">Shuffle your liked albums on Spotify.</p>
      <Spacer factor={1} />
      <div className="flex justify-center">
        <Button onClick={handleLogin}>Login with Spotify</Button>
      </div>
      <Spacer factor={30} />
      <Link
        className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 text-gray-400 hover:text-white hover:underline"
        href="/privacy"
      >
        Privacy policy
      </Link>
    </main>
  );
}
