import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "./loginApi";

const ALERT_FADE_MS = 150;

export function useLoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isErrorAlertClosing, setIsErrorAlertClosing] = useState(false);
  const dismissErrorTimerRef = useRef<number>();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (dismissErrorTimerRef.current) {
        window.clearTimeout(dismissErrorTimerRef.current);
      }
    };
  }, []);

  async function submitLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (dismissErrorTimerRef.current) {
      window.clearTimeout(dismissErrorTimerRef.current);
    }

    setError("");
    setIsErrorAlertClosing(false);

    try {
      const data = await loginUser({ identifier, password });

      localStorage.setItem("token", data.access_token);
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err));
      setIsErrorAlertClosing(false);
    }
  }

  function dismissErrorAlert() {
    setIsErrorAlertClosing(true);

    dismissErrorTimerRef.current = window.setTimeout(() => {
      setError("");
      setIsErrorAlertClosing(false);
    }, ALERT_FADE_MS);
  }

  function goToRegister() {
    navigate("/register");
  }

  return {
    identifier,
    setIdentifier,
    password,
    setPassword,
    error,
    isErrorAlertClosing,
    submitLogin,
    dismissErrorAlert,
    goToRegister,
  };
}

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

export function useLogoutAlert() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [isLogoutAlertClosing, setIsLogoutAlertClosing] = useState(false);

  useEffect(() => {
    if (!location.state?.loggedOut) {
      return;
    }

    setShowLogoutAlert(true);
    setIsLogoutAlertClosing(false);
    navigate(location.pathname, { replace: true });
  }, [location.pathname, location.state, navigate]);

  function dismissLogoutAlert() {
    setIsLogoutAlertClosing(true);

    window.setTimeout(() => {
      setShowLogoutAlert(false);
      setIsLogoutAlertClosing(false);
    }, ALERT_FADE_MS);
  }

  return {
    showLogoutAlert,
    isLogoutAlertClosing,
    dismissLogoutAlert,
  };
}

function getErrorMessage(err: unknown) {
  return err instanceof Error ? err.message : "Something went wrong.";
}
