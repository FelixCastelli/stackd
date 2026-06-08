type RegisterFormProps = {
  username: string;
  email: string;
  password: string;
  onUsernameChange: (username: string) => void;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onGoToLogin: () => void;
};

export function RegisterForm({
  username,
  email,
  password,
  onUsernameChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onGoToLogin,
}: RegisterFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" aria-label="Registration form">
      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(event) => onEmailChange(event.target.value)}
        required
        className="w-full px-4 py-3 rounded-md bg-[#272c37] border border-[#3b414e] placeholder:text-[#c5d7e747] text-[#cbd4dc] text-sm focus:outline-none focus:border-[#839df9] focus:ring-1 focus:ring-[#839df9] transition-colors"
      />

      <div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(event) => onUsernameChange(event.target.value)}
          required
          className="w-full px-4 py-3 rounded-md bg-[#272c37] border border-[#3b414e] placeholder:text-[#c5d7e747] text-[#cbd4dc] text-sm focus:outline-none focus:border-[#839df9] focus:ring-1 focus:ring-[#839df9] transition-colors"
        />
        <p className="mt-2 text-xs text-[#8f9ca7]">Maximum of 16 characters</p>
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          required
          className="w-full px-4 py-3 rounded-md bg-[#272c37] border border-[#3b414e] placeholder:text-[#c5d7e747] text-[#cbd4dc] text-sm focus:outline-none focus:border-[#839df9] focus:ring-1 focus:ring-[#839df9] transition-colors"
        />
        <p className="mt-2 text-xs text-[#8f9ca7]">Minimum of 6 characters</p>
      </div>

      <button
        type="submit"
        className="w-full mt-6 bg-[#00d58e] hover:bg-[#00e196] text-white py-3 rounded-md font-medium transition-colors"
      >
        Register
      </button>

      <div className="mt-2 w-full text-center">
        <button
          type="button"
          onClick={onGoToLogin}
          className="inline-block w-full text-[#cbd4dc] font-medium cursor-pointer hover:text-white transition-colors bg-transparent border-0"
        >
          Already have an account? Log in
        </button>
      </div>
    </form>
  );
}
