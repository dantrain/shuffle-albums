import { NextRouter } from "next/router";

const logout = (router: NextRouter) => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("access_token_expiry");
  localStorage.removeItem("refresh_token");
  router.push("/login");
};

export default logout;
