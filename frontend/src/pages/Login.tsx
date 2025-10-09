import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login - GameHub";
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:8000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username,
          password,
        }),
      });
      if (!response.ok) {
        throw new Error("Incorrect email or password. Please try again.");
      }
      const data = await response.json();
      localStorage.setItem("token", data.access_token); // Saves the JWT
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
    <div className="flex items-center justify-center min-h-screen bg-black">
      <form
        onSubmit={login}
        className="w-full max-w-md space-y-2"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-700 rounded bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-700 rounded bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <button
          type="submit"
          className="w-full bg-white text-black py-2 rounded hover:bg-gray-200 transition font-semibold"
        >
          Login
        </button>
        <button
          type="button"
          onClick={goToRegister}
          className="w-full bg-white text-black py-2 rounded hover:bg-gray-200 transition font-semibold"
        >
          Register
        </button>
        {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
      </form>
    </div>
  );
}