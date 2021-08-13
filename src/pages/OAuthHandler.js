import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { saveAccessToken } from "../logic/helpers";

const OAuthHandler = () => {
  const location = useLocation();

  useEffect(() => {
    const accessToken = new URLSearchParams(
      location.hash.replace("#", "?")
    ).get("access_token");

    saveAccessToken(accessToken, window.localStorage.getItem("token"));
  }, []);

  return <h3>DocuSign account linked! You may now close this page</h3>;
};

export default OAuthHandler;
