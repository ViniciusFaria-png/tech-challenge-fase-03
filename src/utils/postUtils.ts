export interface Post {
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
}

export function filterPostsBySubject(posts: Post[], selectedSubject: string): Post[] {
  return posts.filter(post => 
    selectedSubject === "All Subjects" || post.teacher.subject === selectedSubject
  );
}

export function sortPosts(posts: Post[], sortBy: string): Post[] {
  return [...posts].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.likes - a.likes;
      case "comments":
        return b.comments - a.comments;
      case "recent":
      default:
        return 0; // Keep original order for "recent"
    }
  });
}

export function getActiveFilters(selectedSubject: string): string[] {
  const activeFilters = [];
  if (selectedSubject !== "All Subjects") {
    activeFilters.push(selectedSubject);
  }
  return activeFilters;
}