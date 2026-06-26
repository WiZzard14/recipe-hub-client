"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const router = useRouter();
  const { setIsLoggedIn } = useAuth(); // Context theke pull kora

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Cookie set korar jonno
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("isLoggedIn", "true"); // UI State save
        setIsLoggedIn(true); // Context update
        alert("Login Successful!");
        router.push("/add-recipe");
      } else {
        alert("Login Failed: " + (data.message || "Invalid Credentials"));
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Network Error!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow-lg rounded-2xl border">
      <h2 className="text-2xl font-bold mb-6 text-center text-orange-500">Login to RecipeHub</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input type="email" placeholder="Email Address" required className="p-3 border rounded-lg focus:outline-orange-500" onChange={(e) => setFormData({...formData, email: e.target.value})} />
        <input type="password" placeholder="Password" required className="p-3 border rounded-lg focus:outline-orange-500" onChange={(e) => setFormData({...formData, password: e.target.value})} />
        <button type="submit" className="bg-orange-500 text-white p-3 rounded-lg font-bold hover:bg-orange-600">Login</button>
      </form>
    </div>
  );
}