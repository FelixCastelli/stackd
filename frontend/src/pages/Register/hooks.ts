import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRegisteredUser, registerUser } from "./registerApi";

const ALERT_FADE_MS = 150;

export function useRegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
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

  async function submitRegistration(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (dismissErrorTimerRef.current) {
      window.clearTimeout(dismissErrorTimerRef.current);
    }

    setError("");
    setIsErrorAlertClosing(false);

    try {
      const credentials = { email, username, password };

      await registerUser(credentials);
      const data = await loginRegisteredUser(credentials);

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

  function goToLogin() {
    navigate("/login");
  }

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    error,
    isErrorAlertClosing,
    submitRegistration,
    dismissErrorAlert,
    goToLogin,
  };
}

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

function getErrorMessage(err: unknown) {
  return err instanceof Error ? err.message : "Something went wrong.";
}
