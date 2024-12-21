export type GPT = {
    id: string;
    name: string;
    shortDescription: string;
    longDescription: string;
    category: string;
    tags: string[];
    url: string;
    upvotes: number;
    views?: number;
    launchDate: string;
    comments: Comment[];
}

export type Comment = {
    id: string;
    text: string;
    author: string;
    isFounder?: boolean;
    date: string;
    upvotes: number;
    replies: Reply[];
    replyCount: number;
    gptId: string;
};

export type Reply = {
    id: string;
    text: string;
    author: string;
    date: string;
    upvotes: number;
    quotedReplyId?: string;
    quotedText?: string;
};

export type Email = {
    email: string;
    subscribedAt: string;
}

export interface ReadmeManager {
    totalCount: number;
    roundedCount: string;
    categories: Set<string>;
    content: string[];
}

