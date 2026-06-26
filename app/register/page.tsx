"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    image: "" 
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
    <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow-lg rounded-2xl border">
      <h2 className="text-2xl font-bold mb-6 text-center text-orange-500">Create Account</h2>
      
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input 
          placeholder="Full Name" 
          className="p-3 border rounded-lg focus:outline-orange-500" 
          required
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
        />
        <input 
          type="email" 
          placeholder="Email Address" 
          className="p-3 border rounded-lg focus:outline-orange-500" 
          required
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="p-3 border rounded-lg focus:outline-orange-500" 
          required
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
        />
        <input 
          placeholder="Profile Image URL" 
          className="p-3 border rounded-lg focus:outline-orange-500" 
          required
          onChange={(e) => setFormData({...formData, image: e.target.value})} 
        />
        <button type="submit" className="bg-orange-500 text-white p-3 rounded-lg font-bold hover:bg-orange-600 transition-all mt-2">
          Register
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center w-full mt-6 border border-t">
        <div className="absolute px-5 bg-white text-gray-500 text-sm">Or</div>
      </div>

      {/* Google Sign Up Button */}
      <button type="button" className="w-full mt-6 flex items-center justify-center gap-3 p-3 border rounded-lg font-medium hover:bg-gray-50 transition-all">
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
        Sign up with Google
      </button>
    </div>
  );
}