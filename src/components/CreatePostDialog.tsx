import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { X, Plus } from "lucide-react";
import { Post } from "../utils/postUtils";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatePost: (post: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'isLiked'>) => void;
  editingPost?: Post | null;
}

export function CreatePostDialog({ open, onOpenChange, onCreatePost, editingPost }: CreatePostDialogProps) {
  const [content, setContent] = useState(editingPost?.content || "");
  const [subject, setSubject] = useState(editingPost?.teacher.subject || "");
  

  const subjects = [
    "Mathematics",
    "Science", 
    "English",
    "History",
    "Art",
    "Physical Education",
    "Music",
    "Computer Science"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const postData = {
      teacher: {
        name: "Sarah Johnson", // In a real app, this would come from user session
        subject
      },
      content: content.trim()
    };

    onCreatePost(postData);
    
    // Reset form
    setContent("");
    setSubject("");
    onOpenChange(false);
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {editingPost ? "Edit Post" : "Create New Post"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="subject">Subject</label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subj) => (
                    <SelectItem key={subj} value={subj}>
                      {subj}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="content">Post Content</label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your teaching experience, classroom activities, or educational insights..."
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingPost ? "Update Post" : "Create Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}