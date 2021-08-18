import fetch from "isomorphic-unfetch";
import memoizeOne from "memoize-one";
import router from "next/dist/client/router";

const refreshAccessToken = memoizeOne(async (refreshToken: string) => {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  const data = await res.json();

  if (!(data.access_token && data.expires_in && data.refresh_token)) {
    throw new Error();
  }

  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem(
    "access_token_expiry",
    (Date.now() + parseInt(data.expires_in, 10) * 1000).toString()
  );
  localStorage.setItem("refresh_token", data.refresh_token);

  return data.access_token;
});

const fetcher = async <JSON = any>(
  path: string,
  options?: RequestInit
): Promise<JSON> => {
  let accessToken = localStorage.getItem("access_token");
  const accessTokenExpiry = localStorage.getItem("access_token_expiry");
  const refreshToken = localStorage.getItem("refresh_token");

  if (!accessToken || !accessTokenExpiry || !refreshToken) {
    await router.push("/login");
    throw new Error("Not logged in");
  }

  if (+accessTokenExpiry < Date.now() + 300000) {
    accessToken = await refreshAccessToken(refreshToken);
  }

  const res = await fetch(`https://api.spotify.com/v1${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...options?.headers,
    },
    ...options,
  });

  return res.json();
};

export default fetcher;
