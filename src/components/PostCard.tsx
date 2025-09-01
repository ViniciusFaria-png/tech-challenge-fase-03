import { Heart, MessageCircle, Share2, BookOpen, Clock, MapPin, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface PostCardProps {
  post: {
    id: string;
    teacher: {
      name: string;
      avatar: string;
      subject: string;
      school: string;
    };
    content: string;
    image?: string;
    timestamp: string;
    likes: number;
    comments: number;
    isLiked: boolean;
    tags: string[];
  };
  isLoggedIn?: boolean;
  onEdit?: (post: PostCardProps['post']) => void;
  onDelete?: (postId: string) => void;
}

export function PostCard({ post, isLoggedIn = false, onEdit, onDelete }: PostCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={post.teacher.avatar} />
              <AvatarFallback>{post.teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold">{post.teacher.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  <BookOpen className="h-3 w-3 mr-1" />
                  {post.teacher.subject}
                </Badge>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{post.teacher.school}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{post.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
          
          {isLoggedIn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(post)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Post
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete?.(post.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          <p className="text-foreground leading-relaxed">{post.content}</p>
          
          {post.image && (
            <div className="relative overflow-hidden rounded-lg">
              <ImageWithFallback 
                src={post.image} 
                alt="Post content"
                className="w-full h-64 object-cover"
              />
            </div>
          )}
          
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`space-x-2 ${post.isLiked ? 'text-red-500' : ''}`}
              >
                <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                <span>{post.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments}</span>
              </Button>
            </div>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}