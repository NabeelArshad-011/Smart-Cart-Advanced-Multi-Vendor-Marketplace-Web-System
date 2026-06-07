import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../server";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [accountType, setAccountType] = useState("user");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = accountType === "seller" ? "/shop/forgot-password" : "/user/forgot-password";

    try {
      const { data } = await axios.post(`${server}${endpoint}`, { email }, { withCredentials: true });
      toast.success(data.message);
      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-white text-center">Reset Password</h1>
        <p className="mt-2 text-sm text-gray-400 text-center">Choose the account type and enter the email tied to that account.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Account Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setAccountType("user")} className={`py-3 rounded-lg border transition ${accountType === "user" ? "bg-yellow-500 text-black border-yellow-500" : "bg-gray-800 text-gray-300 border-gray-700"}`}>
                User
              </button>
              <button type="button" onClick={() => setAccountType("seller")} className={`py-3 rounded-lg border transition ${accountType === "seller" ? "bg-yellow-500 text-black border-yellow-500" : "bg-gray-800 text-gray-300 border-gray-700"}`}>
                Seller
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter your account email"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-yellow-500 text-black font-medium disabled:opacity-50">
            {loading ? "Sending link..." : "Send reset link"}
          </button>

          <p className="text-center text-sm text-gray-400">
            Remembered it? <Link to="/login" className="text-yellow-500 hover:text-yellow-400">Back to login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;