import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Register - GameHub";
  }, []);

  async function register(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:8000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Registration failed. Please try again.");
      }

      // Log automatically in after registration (later)
      // const data = await response.json();
      // localStorage.setItem("token", data.access_token);

      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function goToLogin(e: React.FormEvent) {
    e.preventDefault();
    navigate("/login");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <form className="w-full max-w-md space-y-4" onSubmit={register}>
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Create an Account
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-700 rounded bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-700 rounded bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-700 rounded bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
        />

        <button
          type="submit"
          className="w-full bg-white text-black py-2 rounded hover:bg-gray-200 transition font-semibold"
        >
          Register
        </button>

        <p className="mt-4 text-sm text-center text-gray-400">
          Already have an account?{" "}
          <a
            href="#"
            onClick={goToLogin}
            className="text-white hover:underline"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
