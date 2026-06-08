type LoginFormProps = {
  identifier: string;
  password: string;
  onIdentifierChange: (identifier: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onGoToRegister: () => void;
};

export function LoginForm({
  identifier,
  password,
  onIdentifierChange,
  onPasswordChange,
  onSubmit,
  onGoToRegister,
}: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="login-form" aria-label="Login form">
      <input
        type="text"
        placeholder="Email"
        value={identifier}
        onChange={(event) => onIdentifierChange(event.target.value)}
        required
        className="login-input"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => onPasswordChange(event.target.value)}
        required
        className="login-input"
      />

      <button
        type="submit"
        className="login-submit-button"
      >
        Log in
      </button>

      <div className="login-secondary-action">
        <button
          type="button"
          onClick={onGoToRegister}
          className="login-secondary-button"
        >
          New User? Sign up here
        </button>
      </div>
    </form>
  );
}
