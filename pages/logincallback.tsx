import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";

const LoginCallback: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const state = localStorage.getItem("pkce_state");
    const codeVerifier = localStorage.getItem("pkce_code_verifier");

    localStorage.removeItem("pkce_state");
    localStorage.removeItem("pkce_code_verifier");

    if (
      urlParams.has("code") &&
      urlParams.has("state") &&
      codeVerifier &&
      state
    ) {
      if (urlParams.get("state") !== state) {
        return alert("Invalid state");
      }

      const fetchAccessToken = async () => {
        const res = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          body: new URLSearchParams({
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
            grant_type: "authorization_code",
            code: urlParams.get("code")!,
            redirect_uri: `${window.location.origin}/logincallback`,
            code_verifier: codeVerifier,
          }),
        });

        const data = await res.json();

        if (data.access_token && data.expires_in && data.refresh_token) {
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem(
            "access_token_expiry",
            (Date.now() + parseInt(data.expires_in, 10) * 1000).toString()
          );
          localStorage.setItem("refresh_token", data.refresh_token);
        }

        await router.push("/");
      };

      fetchAccessToken();
    }
  }, [router]);

  return <></>;
};

export default LoginCallback;
