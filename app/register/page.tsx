"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    image: "" // Notun field
  });
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration Successful! Please login.");
        router.push("/login");
      } else {
        alert("Registration Failed: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      alert("Network error. Check if backend is running.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input 
          placeholder="Name" 
          className="p-3 border rounded-lg" 
          required
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
        />
        <input 
          type="email" 
          placeholder="Email" 
          className="p-3 border rounded-lg" 
          required
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="p-3 border rounded-lg" 
          required
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
        />
        <input 
          placeholder="Profile Image URL" 
          className="p-3 border rounded-lg" 
          required
          onChange={(e) => setFormData({...formData, image: e.target.value})} 
        />
        <button className="bg-orange-500 text-white p-3 rounded-lg font-bold hover:bg-orange-600 transition">
          Register
        </button>
      </form>
    </div>
  );
}