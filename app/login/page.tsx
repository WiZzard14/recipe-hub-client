"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Login Successful!");
      router.push("/add-recipe");
    } else {
      alert("Invalid Credentials!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input type="email" placeholder="Email" className="p-3 border rounded-lg" onChange={(e) => setFormData({...formData, email: e.target.value})} />
        <input type="password" placeholder="Password" className="p-3 border rounded-lg" onChange={(e) => setFormData({...formData, password: e.target.value})} />
        <button className="bg-orange-500 text-white p-3 rounded-lg font-bold">Login</button>
      </form>
    </div>
  );
}