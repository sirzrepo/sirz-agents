// Mock types to replace Convex types
export interface Doc<T> {
  _id: string;
  _creationTime: number;
  [key: string]: any;
}

export type DocPageContent = Doc<'pageContents'>;

export type DocProduct = Doc<'products'>;

export type DocMedia = Doc<'media'> & {
    url: string
};