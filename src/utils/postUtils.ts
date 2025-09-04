export interface Post {
  id: string;
  teacher: {
    name: string;
    subject: string;
  };
  content: string;
  timestamp: string;
}

export function filterPostsBySubject(posts: Post[], selectedSubject: string): Post[] {
  return posts.filter(post => 
    selectedSubject === "All Subjects" || post.teacher.subject === selectedSubject
  );
}

export function sortPosts(posts: Post[], sortBy: string): Post[] {
  return [...posts].sort((a, b) => {
    return 0; // Keep original order for "recent"
  });
}

export function getActiveFilters(selectedSubject: string): string[] {
  const activeFilters = [];
  if (selectedSubject !== "All Subjects") {
    activeFilters.push(selectedSubject);
  }
  return activeFilters;
}