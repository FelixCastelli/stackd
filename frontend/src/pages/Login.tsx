import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login | Backloggr";
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:8000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username: identifier, password }),
      });
      if (!response.ok) {
        throw new Error("Incorrect email or password. Please try again.");
      }
      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function goToRegister(e: React.FormEvent) {
    e.preventDefault();
    navigate("/register");
  }

  return (
    <div className="min-h-screen bg-[#16181c] text-white font-medium">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="h-16 flex items-center">
          <div className="text-2xl font-semibold">Backloggr</div>
        </header>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-xl mt-12 px-6">
          <h1 className="text-[3rem] font-extralight text-[#8f9ca7] text-center mb-2">
            Welcome Back
          </h1>

          <form onSubmit={login} className="space-y-4" aria-label="Login form">
            {error && (
              <div className="text-center text-sm text-red-400 mb-2">{error}</div>
            )}

            <input
              type="text"
              placeholder="Email or Username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md bg-[#272c37] border border-[#3b414e] placeholder:text-[#c5d7e747] text-[#cbd4dc] text-sm focus:outline-none focus:border-[#839df9] focus:ring-1 focus:ring-[#839df9] transition-colors"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md bg-[#272c37] border border-[#3b414e] placeholder:text-[#c5d7e747] text-[#cbd4dc] text-sm focus:outline-none focus:border-[#839df9] focus:ring-1 focus:ring-[#839df9] transition-colors"
            />

            <button
              type="submit"
              className="w-full mt-6 bg-[#00d58e] hover:bg-[#00e196] text-white py-3 rounded-md font-medium transition-colors"
            >
              Log in
            </button>

            <div className="mt-2 w-full text-center">
              <span
                onClick={goToRegister}
                className="inline-block w-full text-[#cbd4dc] font-medium cursor-pointer hover:text-white transition-colors"
              >
                New User? Sign up here
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
