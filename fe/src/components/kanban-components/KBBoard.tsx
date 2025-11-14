// src/components/kanban-components/KBBoard.tsx
import {useState} from "react";
import {Box, Flex, Input, InputGroup, InputLeftElement, Text, useDisclosure, VStack} from "@chakra-ui/react";
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
import {arrayMove, SortableContext, horizontalListSortingStrategy} from "@dnd-kit/sortable";
import {KBColumn} from "./KBColumn";
import {Card, initialBoardData, List, Label, dummyLabels} from "../../api/dummy-data";
import {CardDetailModal} from "../workspace-components/CardDetailModal";
import {SearchIcon} from "@chakra-ui/icons";

type Suggestion = {
    id: string;
    title: string;
    listId: string;
    listTitle: string;
    card: Card;
};

export function KBBoard() {
    const [lists, setLists] = useState<List[]>(initialBoardData);
    const [labels, setLabels] = useState<Label[]>(dummyLabels);
    const [activeCard, setActiveCard] = useState<Card | null>(null);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [query, setQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedIdx, setHighlightedIdx] = useState(0);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );
    const normalized = query.trim().toLowerCase();
    const displayedLists = normalized
        ? lists.map(list => ({
            ...list,
            cards: list.cards.filter(card =>
                card.title.toLowerCase().includes(normalized)
            ),
        }))
        : lists;

    const suggestions: Suggestion[] =
        normalized.length === 0
            ? []
            : lists
                .flatMap((list) =>
                    list.cards.map((card) => ({
                        id: card.id,
                        title: card.title,
                        listId: list.id,
                        listTitle: list.title,
                        card,
                    }))
                )
                .filter((s) => s.title.toLowerCase().includes(normalized))
                .slice(0, 8);


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
        const newLabel: Label = {id: `lbl-${Date.now()}`, name, color};
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
        const {active, over} = event;
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
        const {active, over} = event;
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

    const selectSuggestion = (s: Suggestion) => {
        handleCardClick(s.card);
        setQuery("");
        setShowSuggestions(false);
        setHighlightedIdx(0);
    };
    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (!showSuggestions && suggestions.length > 0) setShowSuggestions(true);
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIdx((i) => (i + 1) % Math.max(1, suggestions.length));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIdx((i) =>
                (i - 1 + Math.max(1, suggestions.length)) % Math.max(1, suggestions.length)
            );
        } else if (e.key === "Enter") {
            if (suggestions.length > 0) {
                e.preventDefault();
                selectSuggestion(suggestions[Math.min(highlightedIdx, suggestions.length - 1)]);
            }
        } else if (e.key === "Escape") {
            setShowSuggestions(false);
        }
    };

    return (
        <>
            <Box p={4} pt={0}>
                <Box position="relative" maxW="420px">

                    <InputGroup maxW="400px">
                        <InputLeftElement pointerEvents="none">
                            <SearchIcon color="gray.400"/>
                        </InputLeftElement>
                        <Input
                            placeholder="Search cards by title..."
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setShowSuggestions(true);
                                setHighlightedIdx(0);
                            }}
                            onFocus={() => {
                                if (normalized.length > 0) setShowSuggestions(true);
                            }
                            }
                            onBlur={() => {
                                // Delay to allow click on suggestion
                                setTimeout(() => setShowSuggestions(false), 120);
                            }}
                            onKeyDown={handleKeyDown}

                            bg="white"
                        />
                    </InputGroup>
                    {showSuggestions && suggestions.length > 0 && (
                        <Box
                            position="absolute"
                            top="100%"
                            left={0}
                            right={0}
                            mt={1}
                            bg="white"
                            borderWidth="1px"
                            rounded="md"
                            shadow="md"
                            zIndex={50}
                            maxH="300px"
                            overflowY="auto"
                        >
                            <VStack align="stretch" spacing={0}>
                                {suggestions.map((s, idx) => (
                                    <Box
                                        key={s.id}
                                        px={3}
                                        py={2}
                                        cursor="pointer"
                                        bg={idx === highlightedIdx ? "blue.50" : "white"}
                                        _hover={{bg: "blue.100"}}
                                        onMouseEnter={() => setHighlightedIdx(idx)}
                                        onMouseDown={e => {
                                            e.preventDefault();
                                            selectSuggestion(s);
                                        }}
                                    >
                                        <Text fontWeight="medium">
                                            {s.title}
                                        </Text>
                                        <Text fontSize="xs" color="gray.500">
                                            List: {s.listTitle}
                                        </Text>
                                    </Box>
                                ))}
                            </VStack>
                        </Box>
                    )}
                </Box>
            </Box>
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
