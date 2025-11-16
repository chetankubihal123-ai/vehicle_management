import React, { useState } from "react";
import { Car, User, Building, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

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
      setError(err instanceof Error ? err.message : "Authentication failed");
    }
  };

  const demoCredentials = [
    { email: "owner@fleet.com", role: "Fleet Owner", icon: Building },
    { email: "driver@fleet.com", role: "Driver", icon: Truck },
    { email: "personal@user.com", role: "Personal User", icon: User },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "linear-gradient(135deg, #4C1D95, #5B21B6, #6D28D9, #7C3AED)",
      }}
    >
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LEFT SIDE — Branding */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/20 backdrop-blur-xl shadow-2xl rounded-3xl p-10 border border-white/30"
        >
          <div className="flex items-center space-x-4 mb-8">
            <div className="bg-white/20 p-4 rounded-2xl shadow-lg backdrop-blur-lg">
              <Car className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold text-white drop-shadow-md">
              Vehicle<span className="text-yellow-300">Tracker</span>
            </h1>
          </div>

          <h2 className="text-3xl font-semibold text-white drop-shadow mb-4">
            Smart Fleet & Vehicle Management
          </h2>
          <p className="text-white/80 mb-8 text-lg leading-relaxed">
            Manage your vehicles with real-time tracking, service reminders,
            trip logs, and powerful analytics—everything in one place.
          </p>

          <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/30 p-6">
            <h3 className="text-white text-lg font-semibold mb-4">
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
                    className="w-full flex items-center gap-4 p-4 rounded-xl 
                               bg-white/20 backdrop-blur-lg hover:bg-white/30 
                               border border-white/40 text-white transition-all"
                  >
                    <Icon className="h-6 w-6 text-yellow-200" />
                    <div>
                      <p className="font-semibold">{cred.role}</p>
                      <p className="text-white/80 text-sm">{cred.email}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE — Login/Signup Flip Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "signup"}
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-10 border border-white/40"
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-800">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h3>
              <p className="text-gray-500 mt-1">
                {isLogin
                  ? "Sign in to continue"
                  : "Create a new account to begin"}
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg"
              >
                <p className="text-red-700 text-sm">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 
                               focus:ring-2 focus:ring-purple-600 outline-none"
                    placeholder="John Doe"
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 
                             focus:ring-2 focus:ring-purple-600 outline-none"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 
                             focus:ring-2 focus:ring-purple-600 outline-none"
                  placeholder="••••••••"
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-gray-700 mb-1">Account Type</label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as any })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 
                               focus:ring-2 focus:ring-purple-600 outline-none"
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
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 
                           text-white rounded-xl font-semibold shadow-lg 
                           hover:opacity-90 transition-all disabled:opacity-50"
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
                className="text-purple-700 font-semibold hover:underline"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already registered? Sign in"}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
