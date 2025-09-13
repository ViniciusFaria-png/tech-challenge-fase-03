"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Post } from "@/utils/postUtils";

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.id}`);
        
        if (response.ok) {
          const data = await response.json();
          setPost(data);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Post not found</h1>
          <Button onClick={() => router.push('/')} className="bg-pink-500 hover:bg-pink-600">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          onClick={() => router.push('/')} 
          variant="ghost" 
          className="mb-6 text-pink-600 hover:text-pink-700 hover:bg-pink-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Posts
        </Button>

        <Card className="w-full bg-white border-2 border-gray-200 shadow-xl rounded-xl">
          <CardHeader className="pb-6 bg-gray-50 rounded-t-xl">
            <h1 className="text-4xl font-bold text-black mb-4 leading-tight">
              {post.titulo || post.title || 'No Title'}
            </h1>
            {(post.resumo || post.summary) && (
              <p className="text-gray-700 font-medium text-lg italic leading-relaxed mb-4">
                {post.resumo || post.summary}
              </p>
            )}
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2 text-pink-500" />
              <span className="font-medium">
                {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'No date'}
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="prose prose-lg max-w-none">
              <p className="text-black leading-relaxed text-justify whitespace-pre-wrap">
                {post.conteudo || post.content || 'No content available'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}