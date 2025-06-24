export interface IUser {
    id: string;
    first_name?: string;
    last_name?: string;
    image?: string;
    email: string;
    role?: string;
};

export interface IInputProps {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
    type?: string;
    title?: string;
    placeholder?: string;
    value: string;
    required?: boolean;
    error?: string | boolean | undefined;
    className?: string;
    icon?: React.ReactNode;
};

export interface ITextareaProps {
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    name?: string;
    type?: string;
    title?: string;
    placeholder?: string;
    value: string;
    required?: boolean
};

export interface ProjectIdeaType {
    _id?: string;
    idea: string;
    notes?: string;
    status: string;
    service: string;
    createdAt: string
}

export interface DocumentType {
    _id?: string;
    documentName: string;
    fileUrl?: string;
    projectId: string;
    createdAt: string
}

export interface ProjectType {
    _id?: string;
    attachment: string;
    consultant: string;
    manager: string;
    notes: string;
    projectImage?: string;
    projectName?: string;
    status: string;
    createdAt: string
}


export type NotificationType = "success" | "error" | "warning" | "loading"

export interface Notification {
  type?: NotificationType
  title?: string | ""
  message?: string | ""
  details?: string | ""
  id?: string | undefined | null
  submittedData?: Record<string, any>
}

// Generated Assets
export interface GeneratedAssets {
    website_image: string
    logo_image: string
    color_palette: string
    createdAt?: Date
    _id?: string
}

export interface CompanyData {
    companyName?: string;
    industry?: string;
    targetAudience?: string;
    brandValues?: string[];
    preferredStyle?: string;
    additionalNotes?: string;
}

// Example of how to type an array of assets
// const assets: GeneratedAssets[] = [
//   {
//     website_image: "",
//     logo_image: "",
//     color_palette: ""
//   }
// ];

export interface BrandAssets {
    companyData: CompanyData;
    assets: GeneratedAssets[]; // Changed to array of GeneratedAssets
}
