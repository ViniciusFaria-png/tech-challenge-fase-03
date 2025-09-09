"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign-in logic here
    console.log("Sign in:", { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f3f4f6' }}>
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg" style={{ backgroundColor: 'white', border: '1px solid #e5e7eb' }}>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold" style={{ color: '#111827' }}>Welcome Back</h1>
          <p className="text-sm mt-2" style={{ color: '#6b7280' }}>Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-md"
            style={{ backgroundColor: '#f9fafb', borderColor: '#d1d5db' }}
            required
          />
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-md"
            style={{ backgroundColor: '#f9fafb', borderColor: '#d1d5db' }}
            required
          />
          <Button 
            type="submit" 
            className="w-full p-3 rounded-md font-medium transition-colors"
            style={{ backgroundColor: '#2563eb', color: 'white' }}
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}