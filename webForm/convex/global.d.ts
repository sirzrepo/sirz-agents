export interface CreateUserData {
    name?: string,
    image?: string,
    email?: string,
    emailVerificationTime?: number,
    phone?: string,
    phoneVerificationTime?: number,
    username?: string,
    affiliated?: boolean,
    tokenIdentifier?: string
}

export interface UpdateUserData {
    name?: string,
    image?: string,
    email?: string,
    emailVerificationTime?: number,
    phone?: string,
    phoneVerificationTime?: number,
    username?: string,
    affiliated?: boolean,
}

export interface MockMedia {
    fileName: string,
    fileType: string,
    fileSize: number,
    storageId: Id<"_storage">,
    mediaType: 'image' | 'audio' | 'video',
    metadata?: {
        width: number,
        height: number,
        description: string
    }
}

export interface UpdateEventData {
    title?: string,
    description?: Id<"users">,
    dateTime?: number,
    venue?: string,
    venueType?: string,
    eventType?: string,
    thumbnail?: Id<"_storage">,
}