export interface Post {
  id?: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  professor_id?: number;
  created_at?: string;
  updated_at?: string;
}

export function transformApiPost(apiPost: Post): Post {
  return {
    id: apiPost.id,
    conteudo: apiPost.conteudo,
    titulo: apiPost.titulo,
    resumo: apiPost.resumo,
    professor_id: apiPost.professor_id,
    updated_at: new Date(apiPost.updated_at).toLocaleDateString(),
    created_at: new Date(apiPost.created_at).toLocaleDateString()
  };
}

