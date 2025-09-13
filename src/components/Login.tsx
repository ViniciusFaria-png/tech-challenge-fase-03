"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { PasswordInput } from "./ui/password-input";

interface LoginProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: () => void;
}

export function Login({ open, onOpenChange, onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  
  console.log('LOGIN COMPONENT RENDERED - Dialog open:', open);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    console.log('=== LOGIN COMPONENT DIALOG FORM SUBMITTED ===');
    console.log('Email:', email);
    console.log('Password length:', password.length);
    
    try {
      console.log('Making fetch request to /api/auth/signin from LOGIN COMPONENT DIALOG');
      const requestBody = { email, senha: password };
      console.log('Request body:', requestBody);
      
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      console.log('=== LOGIN COMPONENT DIALOG RESPONSE ===');
      console.log('Response status:', response.status);
      console.log('Response statusText:', response.statusText);
      console.log('Response ok:', response.ok);
      
      const responseData = await response.json();
      console.log('Response data:', responseData);
      
      if (response.ok && responseData.token) {
        console.log('Login SUCCESS from dialog:', responseData);
        localStorage.setItem('isProfessor', responseData.user?.isProfessor ? 'true' : 'false');
        setEmail("");
        setPassword("");
        setError("");
        onLogin();
        onOpenChange(false);
        router.push('/');
      }
      else {
        console.log('Login FAILED from dialog - Error data:', responseData);
        console.log('Error message:', responseData.message);
        setError(responseData.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Network error in LOGIN COMPONENT DIALOG:', error);
      setError('Network error. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border-2 border-gray-200 shadow-2xl rounded-xl">
        <DialogHeader className="text-center pb-6">
          <DialogTitle className="text-3xl font-bold text-black mb-2 text-center">Login</DialogTitle>
          <p className="text-gray-600 text-center">Sign in to your account</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 px-4 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all text-black placeholder:text-gray-500"
                required
              />
            </div>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="h-12 px-4 pr-12 bg-white border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all text-black placeholder:text-gray-500 font-medium shadow-sm"
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Sign In
          </Button>
        </form>
        <div className="pt-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or</span>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-gray-600 text-sm">
              Don't have an account yet?{" "}
              <button 
                onClick={() => {
                  onOpenChange(false);
                  router.push('/user/signup');
                }}
                className="font-semibold text-pink-600 hover:text-pink-700 transition-colors duration-200 underline decoration-2 underline-offset-2 hover:decoration-pink-700"
              >
                Create one here
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}