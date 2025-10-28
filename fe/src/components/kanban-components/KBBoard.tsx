// src/components/kanban-components/KBBoard.tsx
import { useEffect, useState } from "react";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import {
    DndContext,
    DragEndEvent,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners, DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { KBColumn } from "./KBColumn";
import { Card, List, Label, Board, Member } from "../../api/dummy-data";
import { CardDetailModal } from "../workspace-components/CardDetailModal";
import apiClient from "../../api/api";
import { NewListCreator } from "./NewListCreator";

interface KBBoardProps {
    initialBoard: Board;
    onAddList: (title: string) => void;
}

export function KBBoard({ initialBoard, onAddList }: KBBoardProps) {
    const [board, setBoard] = useState<Board>(initialBoard);
    const [lists, setLists] = useState<List[]>(initialBoard.lists || []);
    const [labels, setLabels] = useState<Label[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [activeCard, setActiveCard] = useState<Card | null>(null);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        setLists(initialBoard.lists || []);
    }, [initialBoard.lists]);

    useEffect(() => {
        // Fetch all labels and members for the workspace/board
        apiClient.get<Label[]>('/labels').then(res => setLabels(res.data));
        apiClient.get<Member[]>('/members').then(res => setMembers(res.data));
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleCardClick = (card: Card) => {
        setSelectedCard(card);
        onOpen();
    };

    const handleUpdateCard = (updatedCard: Card) => {
        const newLists = lists.map(list => ({
            ...list,
            cards: list.cards.map(card => card.id === updatedCard.id ? updatedCard : card)
        }));
        setLists(newLists);
        if (selectedCard?.id === updatedCard.id) {
            setSelectedCard(updatedCard);
        }
    };

    const handleCreateLabel = (name: string, color: string) => {
        apiClient.post<Label>('/labels', { name, color }).then(response => {
            setLabels(prev => [...prev, response.data]);
        });
    };

    const handleUpdateLabel = (updatedLabel: Label) => {
        apiClient.put<Label>(`/labels/${updatedLabel.id}`, updatedLabel).then(response => {
            setLabels(prev => prev.map(l => l.id === response.data.id ? response.data : l));
            // Also update the label on all cards that use it
            setLists(prevLists => prevLists.map(list => ({
                ...list,
                cards: list.cards.map(card => ({
                    ...card,
                    labels: card.labels?.map(l => l.id === response.data.id ? response.data : l)
                }))
            })));
        });
    };

    const handleAddCard = (listId: number, cardTitle: string) => {
        const newCard = {
            title: cardTitle,
            list: { id: listId } // Nest list object for backend binding
        };

        apiClient.post<Card>('/cards', newCard).then(response => {
            const newLists = lists.map(list => {
                if (list.id === listId) {
                    return {
                        ...list,
                        cards: [...list.cards, response.data]
                    };
                }
                return list;
            });
            setLists(newLists);
        });
    };

    const handleDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === "Card") {
            setActiveCard(event.active.data.current.card);
        }
    };
    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveACard = active.data.current?.type === "Card";
        const isOverACard = over.data.current?.type === "Card";
        const isOverAList = over.data.current?.type === "List";

        if (!isActiveACard) return;

        if (isActiveACard && isOverACard) {
            setLists((prevLists) => {
                const activeListIndex = prevLists.findIndex((l) => l.cards.some(c => c.id === activeId));
                const overListIndex = prevLists.findIndex((l) => l.cards.some(c => c.id === overId));
                const activeCardIndex = prevLists[activeListIndex].cards.findIndex(c => c.id === activeId);
                const overCardIndex = prevLists[overListIndex].cards.findIndex(c => c.id === overId);

                if (activeListIndex === overListIndex) {
                    const newList = [...prevLists];
                    newList[activeListIndex].cards = arrayMove(newList[activeListIndex].cards, activeCardIndex, overCardIndex);
                    return newList;
                } else {
                    const newList = [...prevLists];
                    const [movedCard] = newList[activeListIndex].cards.splice(activeCardIndex, 1);
                    newList[overListIndex].cards.splice(overCardIndex, 0, movedCard);
                    return newList;
                }
            });
        }

        if (isActiveACard && isOverAList) {
            setLists((prevLists) => {
                const activeListIndex = prevLists.findIndex((l) => l.cards.some(c => c.id === activeId));
                const overListIndex = prevLists.findIndex((l) => l.id === overId);

                if (activeListIndex === overListIndex) return prevLists;

                const newList = [...prevLists];
                const [movedCard] = newList[activeListIndex].cards.splice(
                    newList[activeListIndex].cards.findIndex(c => c.id === activeId), 1
                );
                newList[overListIndex].cards.push(movedCard);
                return newList;
            });
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveCard(null);
        const { active, over } = event;
        if (!over) return;

        // Handle List reordering
        if (active.data.current?.type === "List" && over.data.current?.type === "List" && active.id !== over.id) {
            const oldIndex = lists.findIndex((l) => l.id === active.id);
            const newIndex = lists.findIndex((l) => l.id === over.id);
            const newLists = arrayMove(lists, oldIndex, newIndex);

            // Optimistic update
            setLists(newLists);

            // API call to update list order would go here
            // Example: apiClient.post('/lists/reorder', { orderedIds: newLists.map(l => l.id) });
            return;
        }

        // Handle Card reordering
        if (active.data.current?.type === "Card") {
            const originalLists = lists; // Keep a copy to revert on error
            let newLists = [...originalLists];

            const activeList = originalLists.find(l => l.cards.some(c => c.id === active.id));
            const overData = over.data.current;
            const overList = overData?.type === 'List'
                ? originalLists.find(l => l.id === over.id)
                : originalLists.find(l => l.cards.some(c => c.id === over.id));

            if (!activeList || !overList || !activeCard) return;

            const activeListIndex = originalLists.indexOf(activeList);
            const overListIndex = originalLists.indexOf(overList);
            const activeCardIndex = activeList.cards.findIndex(c => c.id === active.id);

            // Moving within the same list
            if (activeList.id === overList.id) {
                const overCardIndex = overList.cards.findIndex(c => c.id === over.id);
                if (activeCardIndex !== overCardIndex && overCardIndex !== -1) {
                    const updatedList = {
                        ...activeList,
                        cards: arrayMove(activeList.cards, activeCardIndex, overCardIndex)
                    };
                    newLists[activeListIndex] = updatedList;
                }
            } else { // Moving to a different list
                const [movedCard] = newLists[activeListIndex].cards.splice(activeCardIndex, 1);
                const overCardIndex = overData?.type === 'Card'
                    ? overList.cards.findIndex(c => c.id === over.id)
                    : overList.cards.length;

                newLists[overListIndex].cards.splice(overCardIndex, 0, movedCard);
            }

            // Optimistic UI update
            setLists(newLists);

            // API call to persist the move
            const newPosition = newLists[overListIndex].cards.findIndex(c => c.id === active.id);
            apiClient.post(`/cards/${active.id}/move`, {
                newListId: overList.id,
                newPosition: newPosition
            }).catch(err => {
                console.error("Failed to move card, reverting.", err);
                // Revert to original state on error
                setLists(originalLists);
            });
        }
    };

    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <Flex gap={4} align="flex-start" overflowX="auto" p={4} h="100%">
                    <SortableContext items={lists.map(l => l.id)} strategy={horizontalListSortingStrategy}>
                        {lists.map((list) => (
                            <KBColumn
                                key={list.id}
                                list={list}
                                onCardClick={handleCardClick}
                                onAddCard={handleAddCard}
                            />
                        ))}
                    </SortableContext>
                    <Box flexShrink={0}>
                        <NewListCreator onAddList={onAddList} />
                    </Box>
                </Flex>
            </DndContext>
            <CardDetailModal
                isOpen={isOpen}
                onClose={onClose}
                card={selectedCard}
                onUpdateCard={handleUpdateCard}
                allLabels={labels}
                allMembers={members}
                onCreateLabel={handleCreateLabel}
                onUpdateLabel={handleUpdateLabel}
            />
        </>
    );
}