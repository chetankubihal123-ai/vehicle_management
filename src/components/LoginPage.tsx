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
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      {/* Background Color Blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-20 w-72 h-72 bg-pink-400 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-green-400 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-72 h-72 bg-blue-400 rounded-full blur-3xl opacity-50 animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Branding & Demo */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center space-y-6 bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-pink-500 via-yellow-400 to-green-500 p-4 rounded-2xl shadow-lg animate-pulse">
              <Car className="h-9 w-9 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-600 via-orange-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
              VehicleTracker
            </h1>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Manage Your Fleet, Drive Smarter 🚗
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Track trips, manage expenses, monitor performance, and stay ahead
            with smart maintenance.
          </p>

          <div className="bg-white/90 rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              🌈 Try Demo Accounts
            </h3>
            <div className="space-y-3">
              {demoCredentials.map((cred, index) => {
                const Icon = cred.icon;
                return (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={index}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        email: cred.email,
                        password: "demo",
                      })
                    }
                    className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-colors text-left"
                  >
                    <Icon className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-semibold text-gray-900">{cred.role}</p>
                      <p className="text-sm text-gray-500">{cred.email}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Right Column - Flip Card */}
        <div className="relative h-[600px] perspective">
          <motion.div
            key={isLogin ? "login" : "signup"}
            initial={{ rotateY: isLogin ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: isLogin ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-white rounded-3xl shadow-xl p-8 border border-gray-100 backface-hidden"
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-pink-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                {isLogin ? "Welcome Back 🎉" : "Join the Family 🌟"}
              </h3>
              <p className="text-gray-600 mt-2">
                {isLogin ? "Sign in to continue" : "Create an account to begin"}
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-red-600 text-sm">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your password"
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as any })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 0px 15px rgba(0,0,0,0.2)",
                }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-pink-500 via-orange-500 to-purple-600 text-white py-3 rounded-lg font-bold transition-all duration-200 disabled:opacity-50 shadow-md"
              >
                {loading
                  ? "Please wait..."
                  : isLogin
                  ? "Sign In 🚀"
                  : "Create Account 🎨"}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-pink-600 hover:text-purple-700 font-medium transition-colors"
              >
                {isLogin
                  ? "🌟 Don't have an account? Sign up"
                  : "🚀 Already have an account? Sign in"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
