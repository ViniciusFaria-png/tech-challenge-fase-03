import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { X, Plus } from "lucide-react";

interface FilterBarProps {
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  activeFilters: string[];
  onRemoveFilter: (filter: string) => void;
  isLoggedIn?: boolean;
  onCreatePost?: () => void;
}

export function FilterBar({ 
  selectedSubject, 
  onSubjectChange, 
  sortBy, 
  onSortChange,
  activeFilters,
  onRemoveFilter,
  isLoggedIn = false,
  onCreatePost
}: FilterBarProps) {
  const subjects = [
    "All Subjects",
    "Mathematics",
    "Science", 
    "English",
    "History",
    "Art",
    "Physical Education",
    "Music",
    "Computer Science"
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedSubject} onValueChange={onSubjectChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="comments">Most Commented</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={() => {
          onSubjectChange("All Subjects");
          onSortChange("recent");
        }}>
          Clear Filters
        </Button>

        {isLoggedIn && (
          <Button onClick={onCreatePost} className="sm:hidden">
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        )}
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="flex items-center gap-1">
              {filter}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 w-4 h-4"
                onClick={() => onRemoveFilter(filter)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}