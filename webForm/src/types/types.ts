import { Id } from "../../convex/_generated/dataModel";

export interface MerchantItem {
  _id: string;
  _creationTime: number;
  userId: string;
  businessName?: string;
  approvalStatus?: string;
  name?: string;
  type?: string;
  email?: string;
  image?: string;
  phone?: string;
  documentDetails?: {
    identityType?: string;
    identityNumber?: string;
    identityDocumentUrl?: string;
    businessLogoUrl?: string;
  };
  bankDetails?: {
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
  };
  address?: {
    street?: string;
    region?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  isVerified?: boolean;
  status?: 'active' | 'inactive' | 'suspended';
  rating?: number;
  totalSales?: number;
  totalListings?: number;
}

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
    required?: boolean
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

export interface IButtonProps {
    onClick: () => void;
    title: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    className?: string;
    loading?: boolean;
};

export interface ISelectProps {
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    name: string;
    title: string;
    options: string[];
    value: string;
    required?: boolean;
    className?: string;
};

export interface IAddressProps {
    branch?: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude: number | undefined;
    longitude: number | undefined;
    isDefault: boolean;
  }

// Transaction type
 interface User {
  _id: Id<"users">;
  _creationTime: number;
  name?: string;
  email?: string;
  phone?: string;
  emailVerificationTime?: number;
  approvalStatus?: string;
  verified?: boolean;
}

interface bookingData {
  deliveryMethod?: string,
  email?: string,
  message?: string,
  name?: string,
  phone?: string,
  preferredDate?: string,
  price?: number,
  quantity?: number,
}



export type Transaction = {
  id: string;
  type: 'sale' | 'purchase' | 'booking';
  item: string;
  amount: number;
  unitPrice: number;
  bookingData: bookingData | null;
  quantity: number;
  buyer: User | null;
  seller: User | null;
  date: string;
  status: string;
  sellerId: Id<"users">;
  buyerId: Id<"users">;
};
  
