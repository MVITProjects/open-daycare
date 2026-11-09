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

export type KidBadgeType = "allergy" | "action";

export interface KidBadge {
  label: string;
  type: KidBadgeType;
  bg: string;
  color: string;
}

export type ParentStatus = "ACTIVA" | "PENDIENTE";

export interface ConnectedParent {
  id: string;
  name: string;
  relationship: string;
  status: ParentStatus;
  avatarInitial: string;
  avatarBg: string;
}

export interface KidProfile {
  id: string;
  slug: string;
  name: string;
  ageYears: number;
  roomName: string;
  birthDateText: string;
  enrollmentDateText: string;
  avatarInitial: string;
  avatarBg: string;
  avatarColor: string;
  badge?: KidBadge;
  allergyNotes?: string;
  parents: ConnectedParent[];
}

export const mockKids: KidProfile[] = [
  {
    id: "kid-1",
    slug: "mateo-fernandez",
    name: "Mateo Fernández",
    ageYears: 3,
    roomName: "Soles",
    birthDateText: "12 mar 2022",
    enrollmentDateText: "feb 2025",
    avatarInitial: "M",
    avatarBg: "#A9D9E8",
    avatarColor: "#1F7A93",
    badge: { label: "MANÍ", type: "allergy", bg: "#FBD8CC", color: "#D9684A" },
    allergyNotes:
      "Alergia al maní. Evitar frutos secos. Lleva inhalador en la mochila.",
    parents: [
      {
        id: "parent-1",
        name: "Lucía Fernández",
        relationship: "Mamá",
        status: "ACTIVA",
        avatarInitial: "L",
        avatarBg: "#C9B6E8",
      },
      {
        id: "parent-2",
        name: "Diego Fernández",
        relationship: "Papá",
        status: "PENDIENTE",
        avatarInitial: "D",
        avatarBg: "#A9C7E8",
      },
    ],
  },
  {
    id: "kid-2",
    slug: "sofia-mendez",
    name: "Sofía Méndez",
    ageYears: 2,
    roomName: "Soles",
    birthDateText: "24 ago 2023",
    enrollmentDateText: "mar 2025",
    avatarInitial: "S",
    avatarBg: "#F4B8CC",
    avatarColor: "#C44A7A",
    parents: [
      {
        id: "parent-3",
        name: "Camila Méndez",
        relationship: "Mamá",
        status: "ACTIVA",
        avatarInitial: "C",
        avatarBg: "#F4B8CC",
      },
    ],
  },
  {
    id: "kid-3",
    slug: "benjamin-ruiz",
    name: "Benjamín Ruiz",
    ageYears: 3,
    roomName: "Soles",
    birthDateText: "05 nov 2022",
    enrollmentDateText: "feb 2025",
    avatarInitial: "B",
    avatarBg: "#B9DEC4",
    avatarColor: "#3E8B62",
    parents: [
      {
        id: "parent-4",
        name: "Valeria Ruiz",
        relationship: "Mamá",
        status: "ACTIVA",
        avatarInitial: "V",
        avatarBg: "#B9DEC4",
      },
      {
        id: "parent-5",
        name: "Martín Ruiz",
        relationship: "Papá",
        status: "ACTIVA",
        avatarInitial: "M",
        avatarBg: "#A9D9E8",
      },
    ],
  },
  {
    id: "kid-4",
    slug: "valentina-soto",
    name: "Valentina Soto",
    ageYears: 2,
    roomName: "Soles",
    birthDateText: "18 may 2023",
    enrollmentDateText: "abr 2025",
    avatarInitial: "V",
    avatarBg: "#F4DC8E",
    avatarColor: "#9A7B1E",
    badge: {
      label: "VINCULAR",
      type: "action",
      bg: "#F9D2DE",
      color: "#C56486",
    },
    parents: [],
  },
  {
    id: "kid-5",
    slug: "tomas-diaz",
    name: "Tomás Díaz",
    ageYears: 3,
    roomName: "Soles",
    birthDateText: "30 ene 2022",
    enrollmentDateText: "feb 2025",
    avatarInitial: "T",
    avatarBg: "#C9B6E8",
    avatarColor: "#7B5FC0",
    badge: {
      label: "LACTOSA",
      type: "allergy",
      bg: "#FBD8CC",
      color: "#D9684A",
    },
    allergyNotes:
      "Intolerancia a la lactosa. Proporcionar merienda sin lácteos.",
    parents: [
      {
        id: "parent-6",
        name: "Esteban Díaz",
        relationship: "Papá",
        status: "ACTIVA",
        avatarInitial: "E",
        avatarBg: "#C9B6E8",
      },
    ],
  },
  {
    id: "kid-6",
    slug: "emma-castro",
    name: "Emma Castro",
    ageYears: 2,
    roomName: "Soles",
    birthDateText: "14 jul 2023",
    enrollmentDateText: "mar 2025",
    avatarInitial: "E",
    avatarBg: "#F4B8CC",
    avatarColor: "#C44A7A",
    parents: [
      {
        id: "parent-7",
        name: "Marina Castro",
        relationship: "Mamá",
        status: "ACTIVA",
        avatarInitial: "M",
        avatarBg: "#F4B8CC",
      },
    ],
  },
  {
    id: "kid-7",
    slug: "lucas-romero",
    name: "Lucas Romero",
    ageYears: 3,
    roomName: "Soles",
    birthDateText: "22 sep 2022",
    enrollmentDateText: "feb 2025",
    avatarInitial: "L",
    avatarBg: "#A9D9E8",
    avatarColor: "#1F7A93",
    parents: [
      {
        id: "parent-8",
        name: "Paula Romero",
        relationship: "Mamá",
        status: "ACTIVA",
        avatarInitial: "P",
        avatarBg: "#A9D9E8",
      },
    ],
  },
  {
    id: "kid-8",
    slug: "olivia-vega",
    name: "Olivia Vega",
    ageYears: 2,
    roomName: "Soles",
    birthDateText: "08 dic 2023",
    enrollmentDateText: "mar 2025",
    avatarInitial: "O",
    avatarBg: "#B9DEC4",
    avatarColor: "#3E8B62",
    parents: [
      {
        id: "parent-9",
        name: "Gonzalo Vega",
        relationship: "Papá",
        status: "ACTIVA",
        avatarInitial: "G",
        avatarBg: "#B9DEC4",
      },
    ],
  },
];

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
