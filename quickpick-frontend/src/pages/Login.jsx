import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://quick-pick-o9en.onrender.com/api/auth/login", {
        email,
        password,
      });

      // ✅ Store JWT in localStorage
      localStorage.setItem("token", res.data.token);

      setMsg("Login successful");

      // ✅ Navigate to home page immediately
      navigate("/");

      // If you want a small delay before navigating, use:
      // setTimeout(() => navigate("/"), 1500);

    } catch (err) {
      setMsg(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#E6C989]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-cyan-600">
          Login
        </h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border p-2 mb-4 rounded focus:ring-2 focus:ring-cyan-400 outline-none"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full border p-2 mb-4 rounded focus:ring-2 focus:ring-cyan-400 outline-none"
          required
        />
        <button
          type="submit"
          className="bg-cyan-500 hover:bg-cyan-600 text-white w-full py-2 rounded font-semibold"
        >
          Login
        </button>
        <p className="mt-2 text-center text-gray-600">{msg}</p>
        <div className="flex justify-between mt-4 text-sm">
          <Link
            to="/signup"
            className="text-cyan-500 hover:underline font-serif"
          >
            Sign up
          </Link>
          <Link
            to="/forgot-password"
            className="text-red-500 hover:underline font-serif"
          >
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
