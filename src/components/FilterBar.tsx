import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, Plus } from "lucide-react";

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (search: string) => void;
  isLoggedIn?: boolean;
  onCreatePost?: () => void;
}

export function FilterBar({ 
  searchTerm,
  onSearchChange,
  isLoggedIn = false,
  onCreatePost
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
        <Input
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 h-12 text-black placeholder:text-gray-500 bg-white border-2 border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 rounded-lg shadow-sm"
        />
      </div>
      
      {isLoggedIn && (
        <Button 
          onClick={onCreatePost}
          className="h-12 px-6 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Post
        </Button>
      )}
    </div>
  );
}