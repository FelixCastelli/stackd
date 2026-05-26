import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRegisteredUser, registerUser } from "./registerApi";

export function useRegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submitRegistration(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      const credentials = { email, username, password };

      await registerUser(credentials);
      const data = await loginRegisteredUser(credentials);

      localStorage.setItem("token", data.access_token);
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err));
    }
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
    submitRegistration,
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
