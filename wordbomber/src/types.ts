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
    name: string;
    type?: string;
    title: string;
    placeholder?: string;
    value: string;
    required?: boolean;
    error?: string | boolean | undefined;
};

export interface ITextareaProps {
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    name: string;
    type?: string;
    title: string;
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