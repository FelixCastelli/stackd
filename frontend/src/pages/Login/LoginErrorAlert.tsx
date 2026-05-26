import "./LogoutAlert.css";

type LoginErrorAlertProps = {
  message: string;
  isClosing: boolean;
  onDismiss: () => void;
};

export function LoginErrorAlert({ message, isClosing, onDismiss }: LoginErrorAlertProps) {
  return (
    <div
      className={`alert alert-backloggd-error alert-dismissible fade mt-2 ${
        isClosing ? "" : "show"
      }`}
      role="alert"
    >
      <p className="mb-0">{message}</p>
      <button
        type="button"
        className="close"
        aria-label="Close"
        onClick={onDismiss}
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}
