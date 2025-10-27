import { Box, Text } from "@chakra-ui/react";
import { useDraggable } from "@dnd-kit/core";

interface TaskCardProps {
    task: { id: string; title: string };
    columnId: string;
}

export function TaskCard({ task, columnId }: TaskCardProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id,
        data: { columnId },
    });

    const style = {
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <Box
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
            p={3}
            bg="white"
            borderWidth="1px"
            rounded="md"
            shadow="sm"
            cursor="grab"
        >
            <Text>{task.title}</Text>
        </Box>
    );
}
