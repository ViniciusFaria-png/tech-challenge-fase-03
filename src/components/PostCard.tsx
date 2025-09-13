import { Clock, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface PostCardProps {
  post: {
    id?: string;
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
  const resumo = post.resumo || post.content?.split('\n\n')[1] || '';
  const conteudo = post.conteudo || post.content?.split('\n\n')[2] || '';
  const timestamp = post.timestamp || (post.created_at ? new Date(post.created_at).toLocaleDateString() : '');
  
  return (
    <Card className="w-full bg-white border-2 border-gray-200 hover:border-pink-300 hover:shadow-xl transition-all duration-200 rounded-xl">
      <CardHeader className="pb-4 bg-gray-50 rounded-t-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-black mb-3 leading-tight">{titulo}</h2>
            {resumo && (
              <CardContent className="pb-2 pt-0">
                <p className="text-gray-700 font-medium text-sm italic leading-relaxed">{resumo}</p>
              </CardContent>
            )}
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2 text-pink-500" />
              <span className="font-medium">{timestamp}</span>
            </div>
          </div>
          
          {isLoggedIn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-pink-100 text-gray-600 hover:text-pink-600">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border-2 border-gray-200 shadow-lg">
                <DropdownMenuItem onClick={() => onEdit?.(post)} className="hover:bg-pink-50 text-black">
                  <Edit className="h-4 w-4 mr-2 text-pink-500" />
                  Editar Post
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => post.id && onDelete?.(post.id)}
                  className="hover:bg-red-50 text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      
      
      {conteudo && (
        <CardContent >
          <div className="prose prose-sm max-w-none">
            <p className="text-black leading-relaxed text-justify text-base">{conteudo}</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}