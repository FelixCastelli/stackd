import "./Alert.css";

type ErrorAlertProps = {
  message: string;
  isClosing: boolean;
  onDismiss: () => void;
};

export function ErrorAlert({ message, isClosing, onDismiss }: ErrorAlertProps) {
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
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
}
