import { Search, BookOpen, Users, Bell, Plus, LogOut } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Login } from "./Login";
import { useState } from "react";

interface HeaderProps {
  isLoggedIn: boolean;
  isProfessor?: boolean;
  onCreatePost: () => void;
  onLogout: () => void;
  onLogin: () => void;
}

export function Header({ isLoggedIn, isProfessor = false, onCreatePost, onLogout, onLogin }: HeaderProps) {
  const [loginOpen, setLoginOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-pink-800 backdrop-blur">
      <div className="container flex h-16 items-center">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold">PostsHub</span>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-1">
            {isLoggedIn && isProfessor && (
              <Button onClick={onCreatePost} size="sm" className="hidden sm:flex">
                <Plus className="h-4 w-4" />
                <span className="ml-2">Create Post</span>
              </Button>
            )}
            {isLoggedIn ? (
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline-block ml-2">Logout</span>
              </Button>
            ) : (
              <Button variant="default" size="sm" onClick={() => setLoginOpen(true)}>
                SignIn
              </Button>
            )}
            <Login
              open={loginOpen}
              onOpenChange={setLoginOpen}
              onLogin={onLogin}
            />
          </nav>
        </div>
      </div>
    </header>
  );
}