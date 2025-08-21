import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);  // 1: Signup form, 2: OTP verify
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/signup', { username, email, password });
      setMsg('OTP sent to your email');
      setStep(2);
    } catch (err) {
      setMsg(err.response?.data?.msg || "Signup failed");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
      localStorage.setItem('token', res.data.token);
      setMsg('Account verified');
      navigate('/login');
    } catch (err) {
      setMsg(err.response?.data?.msg || "OTP verification failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      {step === 1 ? (
        <form onSubmit={handleSignup} className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-3xl font-bold mb-6 text-center text-cyan-600">Sign Up</h2>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full border p-2 mb-4 rounded focus:ring-2 focus:ring-cyan-400 outline-none"
            required
          />

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

          <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white w-full py-2 rounded font-semibold">
            Sign Up
          </button>

          <p className="mt-2 text-sm text-gray-600">{msg}</p>
          <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-cyan-500 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-3xl font-bold mb-6 text-center text-cyan-600">Verify OTP</h2>
          
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="OTP"
            className="w-full p-2 mb-4 border rounded"
            required
          />

          <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded">
            Verify
          </button>

          <p className="mt-2 text-sm text-gray-600">{msg}</p>
        </form>
      )}
    </div>
  );
};

export default Signup;
