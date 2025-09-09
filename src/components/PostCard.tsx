import { Clock, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface PostCardProps {
  post: {
    id: string;
    teacher?: {
      name: string;
      subject: string;
    };
    content?: string;
    timestamp?: string;
    titulo?: string;
    resumo?: string;
    conteudo?: string;
    professor_id?: number;
    created_at?: string;
  };
  isLoggedIn?: boolean;
  onEdit?: (post: PostCardProps['post']) => void;
  onDelete?: (postId: string) => void;
}

export function PostCard({ post, isLoggedIn = false, onEdit, onDelete }: PostCardProps) {
  // Handle both transformed and raw API data
  const titulo = post.titulo || post.content?.split('\n\n')[0] || 'Untitled';
  const conteudo = post.conteudo || post.content?.split('\n\n')[2] || '';
  const timestamp = post.timestamp || (post.created_at ? new Date(post.created_at).toLocaleDateString() : '');
  
  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground mb-2 leading-tight">{titulo}</h2>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>{timestamp}</span>
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
      
      {conteudo && (
        <CardContent className="pt-0">
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground leading-relaxed text-justify">{conteudo}</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}