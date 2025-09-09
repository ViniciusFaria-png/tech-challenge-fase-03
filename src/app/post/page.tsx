"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { PostCard } from "@/components/PostCard";
import { FilterBar } from "@/components/FilterBar";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { Post, ApiPost, transformApiPost } from "@/utils/postUtils";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  
  const filteredPosts = posts.filter(post => {
    const content = post.content || `${(post as any).titulo} ${(post as any).resumo} ${(post as any).conteudo}`;
    return content.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        const apiPosts: ApiPost[] = Array.isArray(data) ? data : [];
        const transformedPosts = apiPosts.map(transformApiPost);
        setPosts(transformedPosts);
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

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (postData: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'isLiked'>) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setCreateDialogOpen(true);
  };

  const handleUpdatePost = async (postData: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'isLiked'>) => {
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
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCreateDialogOpen(false);
    setEditingPost(null);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleOpenCreateDialog = () => {
    setEditingPost(null);
    setCreateDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isLoggedIn={isLoggedIn}
        onCreatePost={handleOpenCreateDialog}
        onLogout={handleLogout}
        onLogin={handleLogin}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Teacher Posts</h1>
            <p className="text-muted-foreground">
              Discover inspiring stories, creative lessons, and educational insights from teachers around the world.
              {!isLoggedIn && " (View Only Mode)"}
            </p>
          </div>

          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            isLoggedIn={isLoggedIn}
            onCreatePost={handleOpenCreateDialog}
          />

          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading posts...</p>
              </div>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post}
                  isLoggedIn={isLoggedIn}
                  onEdit={handleEditPost}
                  onDelete={handleDeletePost}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No posts found matching your search.</p>
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