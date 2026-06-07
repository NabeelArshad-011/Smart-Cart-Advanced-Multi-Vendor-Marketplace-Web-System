import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../server";
import { Link, useNavigate, useParams } from "react-router-dom";

const ResetPasswordPage = () => {
  const { accountType, token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = accountType === "seller" ? "/shop/reset-password" : "/user/reset-password";

    try {
      const { data } = await axios.post(`${server}${endpoint}/${token}`, {
        newPassword,
        confirmPassword,
      }, { withCredentials: true });

      toast.success("Password updated successfully!");
      navigate(accountType === "seller" ? "/shop-login" : "/login");
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-white text-center">Set New Password</h1>
        <p className="mt-2 text-sm text-gray-400 text-center">Create a new password for your {accountType} account.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-yellow-500 text-black font-medium disabled:opacity-50">
            {loading ? "Updating..." : "Update password"}
          </button>

          <p className="text-center text-sm text-gray-400">
            <Link to={accountType === "seller" ? "/shop-login" : "/login"} className="text-yellow-500 hover:text-yellow-400">
              Back to login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;