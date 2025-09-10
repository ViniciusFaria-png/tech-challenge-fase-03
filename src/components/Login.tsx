"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface LoginProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: () => void;
}

export function Login({ open, onOpenChange, onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login dialog form submitted');
    try {
      console.log('Making fetch request to /api/auth/signin from dialog');
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      console.log('Dialog response received:', response.status, response.statusText);
      if (response.ok) {
        onLogin();
        onOpenChange(false);
        setEmail("");
        setPassword("");
        router.push('/');
      } else {
        const errorData = await response.text();
        console.log('Dialog response not ok:', errorData);
      }
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border shadow-xl">
        <DialogHeader className="text-center pb-2">
          <DialogTitle className="text-2xl font-bold text-gray-900">Welcome Back</DialogTitle>
          <p className="text-sm text-gray-600 mt-2">Sign in to your account</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            Sign In
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}