"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Login } from "@/components/Login";
import { User } from "@/utils/userUtils"

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [senha, setPassword] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
      
      const responseData = await response.json();
      
      if (response.ok) {
        setIsSuccess(true);
        setDialogMessage("Account created successfully! You can now sign in.");
        setShowDialog(true);
        setEmail("");
        setPassword("");
      } else {
        setIsSuccess(false);
        setDialogMessage(responseData.message || "Failed to create account. Please try again.");
        setShowDialog(true);
      }
    } catch (error) {
      setIsSuccess(false);
      setDialogMessage("Network error. Please try again.");
      setShowDialog(true);
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    if (isSuccess) {
      setShowLogin(true);
    }
  };

  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setShowLogin(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 rounded-xl shadow-2xl bg-white border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Create Account</h1>
          <p className="text-gray-600">Join us and start your journey</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 px-4 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
              required
            />
            <PasswordInput
              value={senha}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="h-12 px-4 pr-12 bg-white border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all text-black placeholder:text-gray-500 font-medium shadow-sm"
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Create Account
          </Button>
        </form>
        <div className="mt-8 text-center">
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
              Already have an account?{" "}
              <button 
                onClick={() => setShowLogin(true)}
                className="font-semibold text-pink-600 hover:text-pink-700 transition-colors duration-200 underline decoration-2 underline-offset-2 hover:decoration-pink-700"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md bg-white border-2 border-gray-200 shadow-2xl rounded-xl">
          <DialogHeader className="text-center pb-6">
            <DialogTitle className={`text-2xl font-bold mb-2 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
              {isSuccess ? 'Success!' : 'Error'}
            </DialogTitle>
          </DialogHeader>
          <div className="text-center pb-4">
            <p className="text-gray-700">{dialogMessage}</p>
          </div>
          <Button 
            onClick={handleDialogClose}
            className={`w-full h-12 font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl ${
              isSuccess 
                ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
            }`}
          >
            {isSuccess ? 'Continue to Sign In' : 'Try Again'}
          </Button>
        </DialogContent>
      </Dialog>
      
      <Login 
        open={showLogin} 
        onOpenChange={setShowLogin} 
        onLogin={handleLogin}
      />
    </div>
  );
}