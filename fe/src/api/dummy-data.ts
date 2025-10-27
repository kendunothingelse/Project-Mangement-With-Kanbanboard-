// src/data/dummy-data.ts
export interface Member {
    id: string;
    name: string;
    avatarUrl?: string;
}

export interface Label {
    id: string;
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
    id: string;
    title: string;
    description?: string;
    members?: Member[];
    labels?: Label[];
    checklist?: ChecklistItem[];
    comments?: Comment[];
    dueDate?: string;
}

export interface List {
    id: string;
    title: string;
    cards: Card[];
}

export const dummyMembers: Member[] = [
    { id: "mem-1", name: "Ken Adams", avatarUrl: "https://i.pravatar.cc/150?u=mem-1" },
    { id: "mem-2", name: "Jane Doe", avatarUrl: "https://i.pravatar.cc/150?u=mem-2" },
    { id: "mem-3", name: "Peter Jones", avatarUrl: "https://i.pravatar.cc/150?u=mem-3" },
    { id: "mem-4", name: "Mary Smith", avatarUrl: "https://i.pravatar.cc/150?u=mem-4" },
];

export const dummyLabels: Label[] = [
    {id: "lbl-1", name: "Feature", color: "blue.500"},
    {id: "lbl-2", name: "Bug", color: "red.500"},
    {id: "lbl-3", name: "UI", color: "purple.500"},
];

export const initialBoardData: List[] = [
    {
        id: "list-1",
        title: "Ideas",
        cards: [
            {
                id: "card-1",
                title: "Workspace & Project Pages",
                description: "Create pages to manage projects within a workspace.",
                labels: [dummyLabels[0]],
                members: [dummyMembers[0], dummyMembers[3]],
            },
            {
                id: "card-2",
                title: "Implement Due Dates",
                description: "Add due date functionality to cards.",
                members: [dummyMembers[2], dummyMembers[3]],

            },
        ],
    },
    {
        id: "list-2",
        title: "In Progress",
        cards: [
            {
                id: "card-3",
                title: "Develop Sortable Lists",
                description: "Allow users to reorder lists horizontally.",
                labels: [dummyLabels[0], dummyLabels[2]],
                members: [dummyMembers[0], dummyMembers[1]],
                checklist: [
                    {id: "chk-1", text: "Use SortableContext for lists", completed: true},
                    {id: "chk-2", text: "Update drag-end logic", completed: false},
                ],
                dueDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
            },
        ],
    },
    {
        id: "list-3",
        title: "Done",
        cards: [],
    },
];

export interface Board {
    id: string;
    name: string;
    workspaceId: string;
}

export const dummyBoards: Board[] = [
    {id: "board-1", name: "Project Phoenix", workspaceId: "ws-1"},
    {id: "board-2", name: "Marketing Campaign", workspaceId: "ws-1"},
    {id: "board-3", name: "Website Redesign", workspaceId: "ws-1"},
];
