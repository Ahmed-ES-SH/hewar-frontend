// types/project.ts
export interface ProjectLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface ProjectImage {
  id: number;
  project_id: number;
  image_path: string;
}

export interface Category {
  id: number;
  title_en: string;
  title_ar: string;
  icon_name: string;
  bg_color: string;
  image: string;
  created_at: string;
  updated_at: string;
}

export interface projectMetadata {
  title: { ar: string; en: string };
  value: number | string;
}

type ExtendedProjectImage = ProjectImage | { file: File; tempId: string };

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  location: ProjectLocation | null;
  start_date: string;
  completed_at: string;
  status:
    | "pending"
    | "in_progress"
    | "completed"
    | "approved"
    | "canceled"
    | "draft"
    | "rejected";
  target_amount: string;
  collected_amount: string;
  is_urgent: boolean;
  volunteers_needed: number;
  created_by: number;
  category_id: number | string;
  created_at: string;
  updated_at: string;
  images: ExtendedProjectImage[];
  category: Category;
  metadata: projectMetadata[];
  deletedImages?: number[];
  order: number | string;
}

export type ProjectStatus = Project["status"];
