import React, { useState } from "react";
import { Car, User, Building, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const { login, register, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "personal" as "personal" | "fleet_owner" | "driver",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(
          formData.email,
          formData.password,
          formData.name,
          formData.role
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const demoCredentials = [
    { email: "owner@fleet.com", role: "Fleet Owner", icon: Building },
    { email: "driver@fleet.com", role: "Driver", icon: Truck },
    { email: "personal@user.com", role: "Personal User", icon: User },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Section - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center bg-white shadow-lg rounded-3xl p-10"
        >
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-md">
              <Car className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-800">
              Vehicle<span className="text-indigo-600">Tracker</span>
            </h1>
          </div>

          <h2 className="text-2xl font-semibold text-slate-800 mb-3">
            Smart Fleet & Vehicle Management
          </h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Simplify your vehicle management with real-time tracking, trip logs,
            and intelligent insights.
          </p>

          <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50">
            <h3 className="text-base font-semibold text-slate-800 mb-4">
              Try Demo Accounts
            </h3>
            <div className="space-y-3">
              {demoCredentials.map((cred, index) => {
                const Icon = cred.icon;
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        email: cred.email,
                        password: "demo",
                      })
                    }
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 transition-all"
                  >
                    <Icon className="h-5 w-5 text-indigo-500" />
                    <div>
                      <p className="font-medium text-slate-800">{cred.role}</p>
                      <p className="text-sm text-slate-500">{cred.email}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Right Section - Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-lg rounded-3xl p-10 border border-slate-200"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-800">
              {isLogin ? "Welcome Back" : "Create Your Account"}
            </h3>
            <p className="text-slate-500 mt-1">
              {isLogin
                ? "Sign in to access your dashboard"
                : "Join now and get started instantly"}
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-red-600 text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Account Type
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as any })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="personal">Personal User</option>
                  <option value="fleet_owner">Fleet Owner</option>
                  <option value="driver">Driver</option>
                </select>
              </div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-md transition-all disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-600 hover:text-purple-700 font-medium transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
