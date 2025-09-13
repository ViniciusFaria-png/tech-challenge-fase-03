"use client";

import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { PostCard } from "../components/PostCard";
import { FilterBar } from "../components/FilterBar";
import { CreatePostDialog } from "../components/CreatePostDialog";
import { Post } from "../utils/postUtils";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfessor, setIsProfessor] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const { toast } = useToast();
  
  const filteredPosts = posts.filter(post => {
    const content = post.conteudo || `${(post as any).titulo} ${(post as any).resumo} ${(post as any).conteudo}`;
    return content.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
      
        const posts: Post[] = Array.isArray(data) ? data : [];
        setPosts(posts);
      } else {
        console.error('Failed to fetch posts:', response.status, response.statusText);
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const checkAuthStatus = () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userIsProfessor = localStorage.getItem('isProfessor') === 'true';
    setIsLoggedIn(isAuthenticated);
    setIsProfessor(userIsProfessor);
  };

  useEffect(() => {
    checkAuthStatus();
    fetchPosts();
  }, []);



  const handleCreatePost = async (postData: Pick<Post, 'titulo' | 'resumo' | 'conteudo'>) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
      if (response.ok) {
        await fetchPosts();
        toast({
          variant: "success",
          title: "Success!",
          description: "Post created successfully!"
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create post. Please try again."
        });
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error creating post. Please try again."
      });
    }
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post as Post);
    setCreateDialogOpen(true);
  };

  const handleUpdatePost = async (postData: Pick<Post, 'id' | 'titulo' | 'resumo' | 'conteudo'>) => {
    if (!editingPost) return;
    
    try {
      const response = await fetch(`/api/posts/${editingPost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
      if (response.ok) {
        fetchPosts();
        setEditingPost(null);
        toast({
          variant: "success",
          title: "Success!",
          description: "Post updated successfully!"
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update post. Please try again."
        });
      }
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error updating post. Please try again."
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchPosts();
        toast({
          variant: "success",
          title: "Success!",
          description: "Post deleted successfully!"
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete post. Please try again."
        });
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error deleting post. Please try again."
      });
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.log('Logout error:', error);
    }
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('isProfessor');
    setIsLoggedIn(false);
    setIsProfessor(false);
    setCreateDialogOpen(false);
    setEditingPost(null);
  };

  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    checkAuthStatus();
  };

  const handleOpenCreateDialog = () => {
    setEditingPost(null);
    setCreateDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        isLoggedIn={isLoggedIn}
        isProfessor={isProfessor}
        onCreatePost={handleOpenCreateDialog}
        onLogout={handleLogout}
        onLogin={handleLogin}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 py-16 px-8 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl shadow-xl">
            <h1 className="text-5xl font-bold text-white mb-4">
              Posts de <span className="text-pink-400">Professores</span>
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Descubra histórias inspiradoras, aulas criativas e insights educacionais de professores ao redor do mundo.
            </p>
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>

          {/* Posts Section */}
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-lg border-2 border-gray-100">
                <div className="inline-flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                  <p className="text-black text-lg font-medium">Loading posts...</p>
                </div>
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="space-y-6">
                {filteredPosts.map((post, index) => (
                  <div key={post.id || `post-${index}`} className="transform hover:scale-[1.01] transition-all duration-200">
                    <PostCard 
                      post={post}
                      isLoggedIn={isLoggedIn}
                      isProfessor={isProfessor}
                      onEdit={handleEditPost}
                      onDelete={handleDeletePost}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-lg border-2 border-gray-100">
                <div className="space-y-4">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-2xl font-bold text-black">No posts found</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {(() => {
                      const message = searchTerm 
                        ? "Try adjusting your search terms or browse all posts." 
                        : "Be the first to share your teaching experience!";
                      return message;
                    })()}
                  </p>
                  {isLoggedIn && isProfessor && !searchTerm && (
                    <button
                      onClick={handleOpenCreateDialog}
                      className="mt-6 px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg"
                    >
                      Create Your First Post
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <CreatePostDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreatePost={editingPost ? handleUpdatePost : handleCreatePost}
        editingPost={editingPost}
      />
    </div>
  );
}