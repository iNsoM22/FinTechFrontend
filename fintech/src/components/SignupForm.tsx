import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

interface FormData {
  username: string;
  email: string;
  password: string;
}

export default function SignupForm() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

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
    const newErrors: Partial<FormData> = {};

    if (!formData.username || formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validate()) {
      toast.success("Account created successfully 🎉");
      setFormData({ username: "", email: "", password: "" });
    } else {
      toast.error("Please fix the errors in the form.");
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 sm:px-6 lg:px-8">
      <div className="backdrop-blur-md bg-white/5 border border-white/10 text-white rounded-2xl p-6 sm:p-8 w-full max-w-[95%] sm:max-w-[420px] md:max-w-[480px] shadow-2xl">

      <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
  Developer Registration
</h2>

          <p className="text-xs sm:text-sm text-white/60 text-center mb-6">
            Complete the form below to register a new account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-xs sm:text-sm mb-1" htmlFor="username">
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
                } focus:outline-none focus:ring-2 focus:ring-white`}
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
                } focus:outline-none focus:ring-2 focus:ring-white`}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>

          
            <div>
              <label className="block text-xs sm:text-sm mb-1" htmlFor="password">
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
                } focus:outline-none focus:ring-2 focus:ring-white`}
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </div>

          
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-white to-white/80 text-slate-900 hover:from-gray-100 hover:to-white py-2 rounded-md font-semibold text-sm sm:text-base transition-all duration-300 relative overflow-hidden"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
