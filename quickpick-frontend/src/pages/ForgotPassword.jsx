import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Email input, 2: OTP input
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://quick-pick-o9en.onrender.com/api/auth/forgot-password', { email });
      setMsg('OTP sent to your email');
      setStep(2);
    } catch (err) {
      setMsg(err.response?.data?.msg || 'An error occurred');
      console.error('Send OTP error:', err);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://quick-pick-o9en.onrender.com/api/auth/verify-reset-otp', { email, otp });
      setMsg('OTP verified');
      navigate(`/reset-password?token=${res.data.resetToken}`);
    } catch (err) {
      setMsg(err.response?.data?.msg || 'An error occurred');
      console.error('Verify OTP error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E6C989]">
      {step === 1 ? (
        <form onSubmit={handleSendOtp} className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-3xl font-bold mb-6 text-center text-cyan-600">Forgot Password</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border p-2 mb-4 rounded focus:ring-2 focus:ring-cyan-400 outline-none"
            required
          />
          <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white w-full py-2 rounded font-semibold">
            Send OTP
          </button>
          <p className="mt-2 text-sm text-red-500">{msg}</p>
          <Link to="/login" className="text-cyan-500 hover:underline font-serif">Back to Login</Link>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-3xl font-bold mb-6 text-center text-cyan-600">Verify OTP</h2>
          <input
            type="number"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            className="w-full border p-2 mb-4 rounded focus:ring-2 focus:ring-cyan-400 outline-none"
            pattern="[0-9]{6}"
            maxLength="6"
            required
          />
          <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
            Verify OTP
          </button>
          <p className="mt-2 text-sm text-red-500">{msg}</p>
          <Link to="/" className="text-cyan-500 hover:underline font-serif">Back to Login</Link>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;