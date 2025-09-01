import { Search, BookOpen, Users, Bell, Plus, LogOut } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface HeaderProps {
  isLoggedIn: boolean;
  onCreatePost: () => void;
  onLogout: () => void;
}

export function Header({ isLoggedIn, onCreatePost, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold">TeacherHub</span>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search posts..."
                className="w-full rounded-lg bg-input-background pl-8 md:w-[300px] lg:w-[400px]"
              />
            </div>
          </div>
          
          <nav className="flex items-center space-x-1">
            {isLoggedIn && (
              <Button onClick={onCreatePost} size="sm" className="hidden sm:flex">
                <Plus className="h-4 w-4" />
                <span className="ml-2">Create Post</span>
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline-block ml-2">Teachers</span>
            </Button>
            {isLoggedIn && (
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline-block ml-2">Updates</span>
              </Button>
            )}
            {isLoggedIn ? (
              <>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://images.unsplash.com/photo-1584554376766-ac0f2c65e949?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxteGVyJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzU2MzcwNTMxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" />
                  <AvatarFallback>YU</AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="sm" onClick={onLogout}>
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline-block ml-2">Logout</span>
                </Button>
              </>
            ) : (
              <Button variant="default" size="sm" onClick={() => {}}>
                Login
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}