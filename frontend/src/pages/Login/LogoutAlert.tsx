import "./LogoutAlert.css";

type LogoutAlertProps = {
  isClosing: boolean;
  onDismiss: () => void;
};

export function LogoutAlert({ isClosing, onDismiss }: LogoutAlertProps) {
  return (
    <div
      className={`alert alert-warning alert-dismissible fade mt-2 ${
        isClosing ? "" : "show"
      }`}
      role="alert"
    >
      You are now logged out.

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
