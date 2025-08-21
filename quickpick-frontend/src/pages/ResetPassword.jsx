import { useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', { resetToken: token, newPassword });
      setMsg('Password reset successful');
      setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
    } catch (err) {
      setMsg(err.response?.data?.msg || 'An error occurred');
      console.error('Reset password error:', err);
    }
  };

  if (!token) return <p className="text-red-500 text-center mt-10">Invalid token</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E6C989]">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-3xl font-bold mb-6 text-center text-cyan-600">Reset Password</h2>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          className="w-full border p-2 mb-4 rounded focus:ring-2 focus:ring-cyan-400 outline-none"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border p-2 mb-4 rounded focus:ring-2 focus:ring-cyan-400 outline-none"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Reset Password
        </button>
        <p className="mt-2 text-sm text-red-500">{msg}</p>
      </form>
    </div>
  );
};

export default ResetPassword;