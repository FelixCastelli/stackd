import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Register | Backloggr";
  }, []);

  async function register(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:8000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || "Registration failed. Please try again.");
      }

      const loginResponse = await fetch("http://localhost:8000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username: email, password }),
      });

      if(!loginResponse.ok) {
        const errData = await loginResponse.json().catch(() => ({}));
        throw new Error(errData.detail || "Login failed after registration.");
      }

      const data = await loginResponse.json();

      if (!data.access_token) {
        throw new Error("Invalid login response.");
      }

      localStorage.setItem("token", data.access_token);
      
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  }

  async function goToLogin(e: React.FormEvent) {
    e.preventDefault();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-[#16181c] text-[#ffffff] font-medium">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="h-16 flex items-center">
          <div className="text-2xl font-semibold">Backloggr</div>
        </header>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-xl mt-12 px-6">
          <h1 className="text-[3rem] font-extralight text-[#8f9ca7] text-center mb-2">
            Registration
          </h1>

          <form onSubmit={register} className="space-y-4" aria-label="Registration form">
            {error && (
              <div className="text-center text-sm text-red-400 mb-2">{error}</div>
            )}

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md bg-[#272c37] border border-[#3b414e] placeholder:text-[#c5d7e747] text-[#cbd4dc] text-sm focus:outline-none focus:border-[#839df9] focus:ring-1 focus:ring-[#839df9] transition-colors"
            />

            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
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
              <span
                onClick={goToLogin}
                className="inline-block w-full text-[#cbd4dc] font-medium cursor-pointer hover:text-white transition-colors"
              >
                Already have an account? Log in
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
