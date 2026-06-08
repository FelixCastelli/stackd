import { Navbar } from "../../components/navbar/Navbar";
import { ErrorAlert } from "../../components/ErrorAlert";
import { RegisterForm } from "./RegisterForm";
import { useDocumentTitle, useRegisterForm } from "./hooks";

export function Register() {
  const {
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
  } = useRegisterForm();

  useDocumentTitle("Register | Backloggr");

  return (
    <div className="min-h-screen bg-[#16181c] text-[#ffffff] font-medium relative">
      <Navbar />

      <div className="flex justify-center">
        <div className="w-full max-w-xl mt-12 px-6">
          <h1 className="text-[3rem] font-extralight text-[#8f9ca7] text-center mb-2">
            Registration
          </h1>

          {error && (
            <ErrorAlert
              message={error}
              isClosing={isErrorAlertClosing}
              onDismiss={dismissErrorAlert}
            />
          )}

          <RegisterForm
            username={username}
            email={email}
            password={password}
            onUsernameChange={setUsername}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={submitRegistration}
            onGoToLogin={goToLogin}
          />
        </div>
      </div>
    </div>
  );
}
