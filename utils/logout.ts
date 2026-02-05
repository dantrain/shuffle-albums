import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const logout = (router: AppRouterInstance) => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("access_token_expiry");
  localStorage.removeItem("refresh_token");
  router.push("/login");
};

export default logout;
