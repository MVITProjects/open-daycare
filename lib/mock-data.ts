export type PostCategory = "milestone" | "activity" | "announcement";

export const POST_CATEGORY_LABELS: Record<PostCategory, string> = {
  milestone: "LOGRO",
  activity: "ACTIVIDAD",
  announcement: "ANUNCIO",
};

export const POST_CATEGORY_STYLES: Record<
  PostCategory,
  { bg: string; dot: string; text: string }
> = {
  milestone: { bg: "#CFEBD8", dot: "#3E9B6C", text: "#3E9B6C" },
  activity: { bg: "#C7E7F1", dot: "#2E89A6", text: "#2E89A6" },
  announcement: { bg: "#CCD8F4", dot: "#4E72C8", text: "#4E72C8" },
};

export interface FeedPost {
  id: string;
  author: {
    name: string;
    avatarInitial: string;
    avatarBg: string;
    avatarColor: string;
  };
  timestampText: string;
  category: PostCategory;
  recipientText: string;
  content: string;
  photoPlaceholderText?: string;
  likesCount: number;
  commentsCount: number;
}

export interface UserProfile {
  name: string;
  role: string;
  roomName: string;
  avatarInitial: string;
}

export const mockUserProfile: UserProfile = {
  name: "Caro Giménez",
  role: "Maestra · Soles",
  roomName: "Sala Soles",
  avatarInitial: "C",
};

export const mockFeedPosts: FeedPost[] = [
  {
    id: "post-milestone",
    author: {
      name: "Mateo",
      avatarInitial: "M",
      avatarBg: "#A9D9E8",
      avatarColor: "#1F7A93",
    },
    timestampText: "14:20 · publicado por vos",
    category: "milestone",
    recipientText: "Para: familia de Mateo",
    content:
      "¡Usó el orinal solito por primera vez! Estaba feliz de contárselo a todos. Un gran paso.",
    likesCount: 3,
    commentsCount: 1,
  },
  {
    id: "post-activity",
    author: {
      name: "Mateo",
      avatarInitial: "M",
      avatarBg: "#A9D9E8",
      avatarColor: "#1F7A93",
    },
    timestampText: "09:40 · publicado por vos",
    category: "activity",
    recipientText: "Para: familia de Mateo",
    content:
      "Pintamos con témperas esta mañana. Mateo eligió el azul para todo y se concentró un montón mezclando colores.",
    photoPlaceholderText: "Foto · pintando con témperas",
    likesCount: 5,
    commentsCount: 2,
  },
  {
    id: "post-announcement",
    author: {
      name: "Anuncio general",
      avatarInitial: "A",
      avatarBg: "#CCD8F4",
      avatarColor: "#4E72C8",
    },
    timestampText: "07:50 · publicado por vos",
    category: "announcement",
    recipientText: "Para: toda la sala",
    content:
      "El viernes salimos al parque por la mañana. Recuerden mandar gorra y una botellita de agua.",
    likesCount: 8,
    commentsCount: 0,
  },
];
