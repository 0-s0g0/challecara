// アイデア投稿のタグ
export type IdeaTag =
  | "tech"          // テック
  | "entrepreneur"  // アントレ
  | "design"        // デザイン
  | "business"      // ビジネス
  | "healthcare"    // ヘルスケア
  | "education"     // 教育
  | "entertainment" // エンタメ
  | "social"        // ソーシャル
  | "environment"   // 環境
  | "other"         // その他

// タグの詳細情報
export interface IdeaTagInfo {
  tag: IdeaTag
  name: string
  nameEn: string
  description: string
  icon: string
  color: string
  gradient: string
}

// タグのマスターデータ
export const IDEA_TAGS: Record<IdeaTag, IdeaTagInfo> = {
  tech: {
    tag: "tech",
    name: "テック",
    nameEn: "Tech",
    description: "AI、Web、アプリ、プログラミングなど",
    icon: "💻",
    color: "#3B82F6",
    gradient: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
  },
  entrepreneur: {
    tag: "entrepreneur",
    name: "アントレ",
    nameEn: "Entrepreneur",
    description: "起業、新規事業、スタートアップなど",
    icon: "🚀",
    color: "#F59E0B",
    gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
  },
  design: {
    tag: "design",
    name: "デザイン",
    nameEn: "Design",
    description: "UI/UX、グラフィック、プロダクトなど",
    icon: "🎨",
    color: "#EC4899",
    gradient: "linear-gradient(135deg, #EC4899 0%, #DB2777 100%)",
  },
  business: {
    tag: "business",
    name: "ビジネス",
    nameEn: "Business",
    description: "マーケティング、営業、経営戦略など",
    icon: "💼",
    color: "#8B5CF6",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
  },
  healthcare: {
    tag: "healthcare",
    name: "ヘルスケア",
    nameEn: "Healthcare",
    description: "医療、健康、ウェルネス、メンタルなど",
    icon: "🏥",
    color: "#10B981",
    gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
  },
  education: {
    tag: "education",
    name: "教育",
    nameEn: "Education",
    description: "EdTech、学習支援、スキル開発など",
    icon: "📚",
    color: "#6366F1",
    gradient: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
  },
  entertainment: {
    tag: "entertainment",
    name: "エンタメ",
    nameEn: "Entertainment",
    description: "音楽、動画、ゲーム、コンテンツなど",
    icon: "🎬",
    color: "#EF4444",
    gradient: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
  },
  social: {
    tag: "social",
    name: "ソーシャル",
    nameEn: "Social",
    description: "コミュニティ、SNS、つながりなど",
    icon: "🤝",
    color: "#14B8A6",
    gradient: "linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)",
  },
  environment: {
    tag: "environment",
    name: "環境",
    nameEn: "Environment",
    description: "サステナビリティ、エコ、SDGsなど",
    icon: "🌱",
    color: "#84CC16",
    gradient: "linear-gradient(135deg, #84CC16 0%, #65A30D 100%)",
  },
  other: {
    tag: "other",
    name: "その他",
    nameEn: "Other",
    description: "上記に当てはまらないアイデア",
    icon: "✨",
    color: "#64748B",
    gradient: "linear-gradient(135deg, #64748B 0%, #475569 100%)",
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
