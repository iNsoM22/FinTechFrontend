import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { sendUserLoginData, UserLoginData } from "@/service/BackendService";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [mode, setMode] = useState("Developer");
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    remember: false,
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: UserLoginData = {
      username: formData.identifier,
      password: formData.password,
      mode: mode,
    };

    const response = await sendUserLoginData(payload);

    if (response) {
      localStorage.setItem("token", response.access_token);
      toast.success("Logged In Succesfully");
      setInterval(() => {
        navigate("/");
      }, 2000);
      setFormData((prev) => ({
        identifier: "",
        password: "",
        remember: prev.remember,
      }));
    } else {
      toast.error("Unable to Login");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen text-white bg-[#323232]">
      {/* Left Column */}
      <div className="flex-1 bg-[#3a3a3a] flex items-center justify-center p-6">
        <p className="text-2xl md:text-3xl font-semibold text-center">
          Company Logo Here
        </p>
      </div>

      {/* Right Column */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          {/* Mode Selector */}
          <div className="bg-[#2a2a2a] p-4 rounded-xl shadow-md text-center">
            <h3 className="text-lg font-medium mb-2">Select Mode</h3>
            <ToggleGroup
              type="single"
              value={mode}
              onValueChange={(value) => value && setMode(value)}
              className="flex w-full justify-center gap-2"
            >
              <ToggleGroupItem
                value="Developer"
                className={`px-4 py-2 rounded-md border border-gray-600 transition-all duration-300 hover:bg-[#444] cursor-pointer ${
                  mode === "Developer" ? "bg-[#444]" : ""
                }`}
              >
                Developer
              </ToggleGroupItem>
              <ToggleGroupItem
                value="Admin"
                className={`px-4 py-2 rounded-md border border-gray-600 transition-all duration-300 hover:bg-[#444] cursor-pointer ${
                  mode === "Admin" ? "bg-[#444]" : ""
                }`}
              >
                Admin
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Sign In Box */}
          <div className="bg-[#2a2a2a] p-6 rounded-xl shadow-md space-y-4">
            <h2 className="text-2xl font-bold text-center border-b border-gray-500 pb-2">
              Sign In
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">Email Address</Label>
                <Input
                  id="identifier"
                  name="identifier"
                  type="text"
                  placeholder="e.g iNsoM22@gmail.com"
                  className="bg-[#444] text-white border border-gray-600"
                  value={formData.identifier}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="bg-[#444] text-white border border-gray-600"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={formData.remember}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, remember: !!checked }))
                    }
                  />
                  Remember Me
                </label>
                <a href="#" className="text-blue-400 hover:underline">
                  Forgot Password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 transition transform active:scale-95"
              >
                Sign In
              </Button>

              <p className="text-center text-sm">
                Don't have an Account?{" "}
                <Link
                  to="/registration"
                  className="text-blue-400 hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
