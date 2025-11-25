// src/data/model.ts
// src/data/model.ts
export interface Member {
    id: number;
    username: string;
    password: string;
    email: string;
    fullname: string;
    avatarUrl?: string;
    role?: 'ADMIN' | 'USER';
}

export interface Label {
    id: number;
    name: string;
    color: string;
}

export interface ChecklistItem {
    id: string;
    text: string;
    completed: boolean;
}

export interface Comment {
    id: string;
    author: Member;
    text: string;
    createdAt: string;
}

export interface Card {
    id: number;
    title: string;
    description?: string;
    members?: Member[];
    labels?: Label[];
    checklist?: ChecklistItem[];
    comments?: Comment[];
    dueDate?: string;
    cardOrder?: number;
    listId?: number; // For creating/moving cards
}

export interface List {
    id: number;
    title: string;
    cards: Card[];
    listOrder?: number;
}

export interface Board {
    id: number;
    name: string;
    workspaceId: string;
    lists?: List[];
}
