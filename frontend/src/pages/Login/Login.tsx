import { Navbar } from "../../components/navbar/Navbar";
import { ErrorAlert } from "../../components/ErrorAlert";
import { LoginForm } from "./LoginForm";
import { LogoutAlert } from "./LogoutAlert";
import { useDocumentTitle, useLoginForm, useLogoutAlert } from "./hooks";
import "./Login.css";

export function Login() {
  const {
    identifier,
    setIdentifier,
    password,
    setPassword,
    error,
    isErrorAlertClosing,
    submitLogin,
    dismissErrorAlert,
    goToRegister,
  } = useLoginForm();
  const { showLogoutAlert, isLogoutAlertClosing, dismissLogoutAlert } = useLogoutAlert();

  useDocumentTitle("Login | Backloggr");

  return (
    <div className="login-page">
      <Navbar />

      <main className="login-content">
        <div className="login-panel">
          {showLogoutAlert && (
            <LogoutAlert
              isClosing={isLogoutAlertClosing}
              onDismiss={dismissLogoutAlert}
            />
          )}

          <h2 className="login-title">Welcome back</h2>

          {error && (
            <ErrorAlert
              message={error}
              isClosing={isErrorAlertClosing}
              onDismiss={dismissErrorAlert}
            />
          )}

          <LoginForm
            identifier={identifier}
            password={password}
            onIdentifierChange={setIdentifier}
            onPasswordChange={setPassword}
            onSubmit={submitLogin}
            onGoToRegister={goToRegister}
          />
        </div>
      </main>
    </div>
  );
}
