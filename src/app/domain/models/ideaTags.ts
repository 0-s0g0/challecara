// アイデア投稿のタグ
export type IdeaTag =
  | "tech" // テック
  | "entrepreneur" // アントレ
  | "design" // デザイン
  | "business" // ビジネス
  | "healthcare" // ヘルスケア
  | "education" // 教育
  | "entertainment" // エンタメ
  | "social" // ソーシャル
  | "environment" // 環境
  | "other" // その他

// タグの詳細情報
export interface IdeaTagInfo {
  tag: IdeaTag
  name: string
  nameEn: string
  description: string
  icon: string
  color: string
  gradient: string
  imagePath: string
}

// タグのマスターデータ
export const IDEA_TAGS: Record<IdeaTag, IdeaTagInfo> = {
  tech: {
    tag: "tech",
    name: "テック",
    nameEn: "Tech",
    description: "AI、Web、アプリ、プログラミングなど",
    icon: "💻",
    color: "#b7dbff",
    gradient: "linear-gradient(135deg, #b7dbff 0%, #b7ffb7 100%)",
    imagePath: "/icons/tech.png",
  },
  entrepreneur: {
    tag: "entrepreneur",
    name: "アントレ",
    nameEn: "Entrepreneur",
    description: "起業、新規事業、スタートアップなど",
    icon: "🚀",
    color: "#ffffb7",
    gradient: "linear-gradient(135deg, #ffffb7 0%, #b7ffb7 100%)",
    imagePath: "/icons/entrepreneur.png",
  },
  design: {
    tag: "design",
    name: "デザイン",
    nameEn: "Design",
    description: "UI/UX、グラフィック、プロダクトなど",
    icon: "🎨",
    color: "#ffb7ff",
    gradient: "linear-gradient(135deg, #ffb7ff 0%, #b7ffb7 100%)",
    imagePath: "/icons/design.png",
  },
  business: {
    tag: "business",
    name: "ビジネス",
    nameEn: "Business",
    description: "マーケティング、営業、経営戦略など",
    icon: "💼",
    color: "#b7b7ff",
    gradient: "linear-gradient(135deg, #b7b7ff 0%, #b7ffb7 100%)",
    imagePath: "/icons/business.png",
  },
  healthcare: {
    tag: "healthcare",
    name: "ヘルスケア",
    nameEn: "Healthcare",
    description: "医療、健康、ウェルネス、メンタルなど",
    icon: "🏥",
    color: "#dbffb7",
    gradient: "linear-gradient(135deg, #dbffb7 0%, #b7ffb7 100%)",
    imagePath: "/icons/healthcare.png",
  },
  education: {
    tag: "education",
    name: "教育",
    nameEn: "Education",
    description: "EdTech、学習支援、スキル開発など",
    icon: "📚",
    color: "#dbb7ff",
    gradient: "linear-gradient(135deg, #dbb7ff 0%, #b7ffb7 100%)",
    imagePath: "/icons/education.png",
  },
  entertainment: {
    tag: "entertainment",
    name: "エンタメ",
    nameEn: "Entertainment",
    description: "音楽、動画、ゲーム、コンテンツなど",
    icon: "🎬",
    color: "#ffb7db",
    gradient: "linear-gradient(135deg, #ffb7db 0%, #b7ffb7 100%)",
    imagePath: "/icons/entertainment.png",
  },
  social: {
    tag: "social",
    name: "ソーシャル",
    nameEn: "Social",
    description: "コミュニティ、SNS、つながりなど",
    icon: "🤝",
    color: "#ffdbb7",
    gradient: "linear-gradient(135deg, #ffdbb7 0%, #b7ffb7 100%)",
    imagePath: "/icons/social.png",
  },
  environment: {
    tag: "environment",
    name: "環境",
    nameEn: "Environment",
    description: "サステナビリティ、エコ、SDGsなど",
    icon: "🌱",
    color: "#b7ffdb",
    gradient: "linear-gradient(135deg, #b7ffdb 0%, #b7ffb7 100%)",
    imagePath: "/icons/environment.png",
  },
  other: {
    tag: "other",
    name: "その他",
    nameEn: "Other",
    description: "上記に当てはまらないアイデア",
    icon: "✨",
    color: "#ffb2b2",
    gradient: "linear-gradient(135deg, #ffb2b2 0%, #b7ffb7 100%)",
    imagePath: "/icons/other.png",
  },
}

// タグの配列（表示順）
export const IDEA_TAG_LIST: IdeaTag[] = [
  "tech",
  "entrepreneur",
  "design",
  "business",
  "healthcare",
  "education",
  "entertainment",
  "social",
  "environment",
  "other",
]
