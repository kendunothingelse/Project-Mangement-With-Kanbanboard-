// src/components/kanban-components/KBBoard.tsx
import { useState } from "react";
import { Flex, useDisclosure } from "@chakra-ui/react";
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { KBColumn } from "./KBColumn";
import { Card, initialBoardData, List, Label, dummyLabels } from "../../api/dummy-data";
import { CardDetailModal } from "../workspace-components/CardDetailModal";

export function KBBoard() {
    const [lists, setLists] = useState<List[]>(initialBoardData);
    const [labels, setLabels] = useState<Label[]>(dummyLabels);
    const [activeCard, setActiveCard] = useState<Card | null>(null);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

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
        setSelectedCard(updatedCard);
    };

    const handleCreateLabel = (name: string, color: string) => {
        const newLabel: Label = { id: `lbl-${Date.now()}`, name, color };
        setLabels(prev => [...prev, newLabel]);
    };

    const handleUpdateLabel = (updatedLabel: Label) => {
        setLabels(prev => prev.map(l => l.id === updatedLabel.id ? updatedLabel : l));
        // Also update the label on all cards that use it
        setLists(prevLists => prevLists.map(list => ({
            ...list,
            cards: list.cards.map(card => ({
                ...card,
                labels: card.labels?.map(l => l.id === updatedLabel.id ? updatedLabel : l)
            }))
        })));
    };

    const handleAddCard = (listId: string, cardTitle: string) => {
        const newCard: Card = {
            id: `card-${Date.now()}`,
            title: cardTitle,
        };

        const newLists = lists.map(list => {
            if (list.id === listId) {
                return {
                    ...list,
                    cards: [...list.cards, newCard]
                };
            }
            return list;
        });
        setLists(newLists);
    };

    // ... (keep handleDragStart, handleDragOver, handleDragEnd functions)
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
        const { active, over } = event;
        if (!over || active.id === over.id) {
            setActiveCard(null);
            return;
        }

        const isActiveAList = active.data.current?.type === "List";
        if (isActiveAList) {
            setLists((prevLists) => {
                const oldIndex = prevLists.findIndex((l) => l.id === active.id);
                const newIndex = prevLists.findIndex((l) => l.id === over.id);
                return arrayMove(prevLists, oldIndex, newIndex);
            });
        }
        setActiveCard(null);
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
                <Flex gap={4} align="flex-start" overflowX="auto" p={4}>
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
                </Flex>
            </DndContext>
            <CardDetailModal
                isOpen={isOpen}
                onClose={onClose}
                card={selectedCard}
                onUpdateCard={handleUpdateCard}
                allLabels={labels}
                onCreateLabel={handleCreateLabel}
                onUpdateLabel={handleUpdateLabel}
            />
        </>
    );
}
