import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  UserRegistrationData,
  sendUserRegistrationData,
} from "@/service/BackendService";
import { Link, useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const [formData, setFormData] = useState<UserRegistrationData>({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<UserRegistrationData>>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validate = () => {
    const newErrors: Partial<UserRegistrationData> = {};

    if (!formData.username || formData.username.length < 6) {
      newErrors.username = "Username must be at least 6 characters.";
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validate()) {
      const response = await sendUserRegistrationData(formData);
      toast.dismiss();

      if (response) {
        toast.success("Account Created Successfully 🎉");
        setTimeout(() => {
          toast.success("Now You can Sign in");
        }, 2000);
        setFormData({ username: "", email: "", password: "" });
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      }
    } else {
      toast.dismiss();
      toast.error("Invalid Values entered in the Form");
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-[#333] px-4 sm:px-6 lg:px-8">
        <div className="backdrop-blur-md bg-white/5 border border-white/20 text-white rounded-2xl p-6 sm:p-8 w-full max-w-[95%] sm:max-w-[420px] md:max-w-[480px] shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            Developer Registration
          </h2>

          <p className="text-xs sm:text-sm text-white/60 text-center mb-6">
            Complete the form below to register a new account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-xs sm:text-sm mb-1"
                htmlFor="username"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Your username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-md bg-slate-700 text-white placeholder-white/50 border ${
                  errors.username ? "border-red-500" : "border-slate-600"
                } focus:outline-none focus:ring-2 focus:ring-white transition-all duration-300`}
              />
              {errors.username && (
                <p className="text-red-400 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm mb-1" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-md bg-slate-700 text-white placeholder-white/50 border ${
                  errors.email ? "border-red-500" : "border-slate-600"
                } focus:outline-none focus:ring-2 focus:ring-white transition-all duration-300`}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                className="block text-xs sm:text-sm mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="******"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-md bg-slate-700 text-white placeholder-white/50 border ${
                  errors.password ? "border-red-500" : "border-slate-600"
                } focus:outline-none focus:ring-2 focus:ring-white transition-all duration-300`}
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 py-2 rounded-md font-semibold text-sm sm:text-base transition-all duration-300 relative overflow-hidden"
            >
              Sign Up
            </button>

            <p className="text-center text-sm mt-4">
              Already a User?{" "}
              <Link to="/login" className="text-blue-400 hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
