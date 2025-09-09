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
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {isLoggedIn && (
        <Button onClick={onCreatePost}>
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      )}
    </div>
  );
}