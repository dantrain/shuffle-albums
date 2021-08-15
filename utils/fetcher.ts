import fetch from "isomorphic-unfetch";
import router from "next/dist/client/router";

const fetcher = async <JSON = any>(
  path: string,
  options?: RequestInit
): Promise<JSON> => {
  const accessToken = localStorage.getItem("access_token");
  const accessTokenExpiry = localStorage.getItem("access_token_expiry");

  if (!accessToken || !accessTokenExpiry || +accessTokenExpiry < Date.now()) {
    await router.push("/login");
    throw new Error("Not logged in");
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
