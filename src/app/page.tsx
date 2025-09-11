"use client";

import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { PostCard } from "../components/PostCard";
import { FilterBar } from "../components/FilterBar";
import { CreatePostDialog } from "../components/CreatePostDialog";
import { Post, ApiPost, transformApiPost } from "../utils/postUtils";

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
        console.log('Raw API data:', data);
        const apiPosts: ApiPost[] = Array.isArray(data) ? data : [];
        console.log('API posts array:', apiPosts);
        const transformedPosts = apiPosts.map(transformApiPost);
        console.log('Transformed posts:', transformedPosts);
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

  const checkAuthStatus = () => {
    const hasAuthToken = document.cookie.includes('auth-token=');
    if (hasAuthToken) {
      setIsLoggedIn(true);
    }
  };

  useEffect(() => {
    checkAuthStatus();
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

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.log('Logout error:', error);
    }
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
    <div className="min-h-screen bg-white">
      <Header 
        isLoggedIn={isLoggedIn}
        onCreatePost={handleOpenCreateDialog}
        onLogout={handleLogout}
        onLogin={handleLogin}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 py-16 px-8 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl shadow-xl">
            <h1 className="text-5xl font-bold text-white mb-4">
              Teacher <span className="text-pink-400">Posts</span>
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Discover inspiring stories, creative lessons, and educational insights from teachers around the world.
            </p>
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              isLoggedIn={isLoggedIn}
              onCreatePost={handleOpenCreateDialog}
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
                {filteredPosts.map((post) => (
                  <div key={post.id} className="transform hover:scale-[1.01] transition-all duration-200">
                    <PostCard 
                      post={post}
                      isLoggedIn={isLoggedIn}
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
                    {searchTerm ? 
                      "Try adjusting your search terms or browse all posts." : 
                      "Be the first to share your teaching experience!"
                    }
                  </p>
                  {isLoggedIn && !searchTerm && (
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