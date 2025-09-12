import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { X, Plus } from "lucide-react";
import { Post } from "@/utils/postUtils"

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatePost: (post:  Pick<Post, 'titulo' | 'resumo' | 'conteudo'>) => void;
  editingPost?: Post | null;
}

export function CreatePostDialog({ open, onOpenChange, onCreatePost, editingPost }: CreatePostDialogProps) {
  const [titulo, setTitulo] = useState("");
  const [resumo, setResumo] = useState("");
  const [conteudo, setConteudo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const postData = {
      titulo: titulo,
      resumo: resumo,
      conteudo: conteudo
    };

    onCreatePost(postData);
    
    // Reset form
    setTitulo("");
    setResumo("");
    setConteudo("");
    onOpenChange(false);
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white border-2 border-gray-200 shadow-2xl rounded-xl">
        <DialogHeader className="text-center pb-6">
          <DialogTitle className="text-3xl font-bold text-black mb-2">
            {editingPost ? "Edit Post" : "Create New Post"}
          </DialogTitle>
          <p className="text-gray-600">
            {editingPost ? "Update your post content" : "Share your teaching experience with the community"}
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="titulo" className="text-sm font-semibold text-gray-700">
                Título
              </label>
              <Input
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Digite o título do post"
                className="h-12 px-4 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="resumo" className="text-sm font-semibold text-gray-700">
                Resumo
              </label>
              <Textarea
                id="resumo"
                value={resumo}
                onChange={(e) => setResumo(e.target.value)}
                placeholder="Escreva um breve resumo do post"
                rows={3}
                className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all text-black placeholder:text-gray-500 resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="conteudo" className="text-sm font-semibold text-gray-700">
                Conteúdo
              </label>
              <Textarea
                id="conteudo"
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                placeholder="Escreva o conteúdo completo do post"
                rows={6}
                className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all text-black placeholder:text-gray-500 resize-none"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="h-12 px-6 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-semibold rounded-lg transition-all duration-200"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="h-12 px-6 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {editingPost ? "Update Post" : "Create Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}