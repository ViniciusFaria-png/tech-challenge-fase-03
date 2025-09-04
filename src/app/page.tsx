"use client";

import { useState } from "react";
import { Header } from "../components/Header";
import { PostCard } from "../components/PostCard";
import { FilterBar } from "../components/FilterBar";
import { CreatePostDialog } from "../components/CreatePostDialog";
import { mockPosts } from "../data/mockPosts";
import { filterPostsBySubject, sortPosts, getActiveFilters, Post } from "../utils/postUtils";

export default function Home() {
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [sortBy, setSortBy] = useState("recent");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const filteredPosts = filterPostsBySubject(posts, selectedSubject);
  const sortedPosts = sortPosts(filteredPosts, sortBy);

  const activeFilters = getActiveFilters(selectedSubject);

  const handleRemoveFilter = (filter: string) => {
    if (filter === selectedSubject) {
      setSelectedSubject("All Subjects");
    }
  };

  const handleCreatePost = (postData: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'isLiked'>) => {
    const newPost: Post = {
      ...postData,
      id: Date.now().toString(),
      timestamp: "Just now",
   
    };
    
    setPosts([newPost, ...posts]);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setCreateDialogOpen(true);
  };

  const handleUpdatePost = (postData: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'isLiked'>) => {
    if (!editingPost) return;
    
    const updatedPost: Post = {
      ...editingPost,
      ...postData,
      timestamp: editingPost.timestamp + " (edited)"
    };
    
    setPosts(posts.map(post => post.id === editingPost.id ? updatedPost : post));
    setEditingPost(null);
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
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
            selectedSubject={selectedSubject}
            onSubjectChange={setSelectedSubject}
            sortBy={sortBy}
            onSortChange={setSortBy}
            activeFilters={activeFilters}
            onRemoveFilter={handleRemoveFilter}
            isLoggedIn={isLoggedIn}
            onCreatePost={handleOpenCreateDialog}
          />

          <div className="space-y-6">
            {sortedPosts.length > 0 ? (
              sortedPosts.map((post) => (
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
                <p className="text-muted-foreground">No posts found for the selected filters.</p>
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
