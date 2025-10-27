// src/components/kanban-components/KBColumn.tsx
import { Box, Heading, VStack } from "@chakra-ui/react";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { KBTask } from "./KBTask";
import { Card, List } from "../../api/dummy-data";
import { NewCardCreator } from "./NewCardCreator";

interface ColumnProps {
    list: List;
    onCardClick: (card: Card) => void;
    onAddCard: (listId: string, cardTitle: string) => void;
}

export function KBColumn({ list, onCardClick, onAddCard }: ColumnProps) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: list.id,
        data: {
            type: "List",
            list,
        },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <Box
            ref={setNodeRef}
            style={style}
            bg="gray.100"
            rounded="lg"
            shadow="md"
            p={3}
            minW="300px"
            flexShrink={0}
            display="flex"
            flexDirection="column"
        >
            <Heading
                fontSize="lg"
                mb={3}
                {...attributes}
                {...listeners}
                cursor="grab"
            >
                {list.title}
            </Heading>

            <VStack align="stretch" spacing={3} flex="1" overflowY="auto" pr={2}>
                <SortableContext items={list.cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
                    {list.cards.map((card) => (
                        <KBTask key={card.id} card={card} onCardClick={onCardClick} />
                    ))}
                </SortableContext>
            </VStack>
            <Box mt={4}>
                <NewCardCreator onAddCard={(title) => onAddCard(list.id, title)} />
            </Box>
        </Box>
    );
}
