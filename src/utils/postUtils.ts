export interface Post {
  id: string;
  teacher: {
    name: string;
    subject: string;
  };
  content: string;
  timestamp: string;
}

export interface ApiPost {
  id: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  professor_id: number;
  created_at: string;
  updated_at: string;
}

export function transformApiPost(apiPost: ApiPost): Post {
  return {
    id: apiPost.id,
    teacher: {
      name: `Professor ${apiPost.professor_id}`,
      subject: "General"
    },
    content: `${apiPost.titulo}\n\n${apiPost.resumo}\n\n${apiPost.conteudo}`,
    timestamp: new Date(apiPost.created_at).toLocaleDateString()
  };
}

