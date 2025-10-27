import {
    Box,
    Heading,
    VStack,
    Button,
    Input,
    useDisclosure,
    Collapse,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {TaskCard} from "./KBTask";

interface Task {
    id: string;
    title: string;
}

interface ColumnProps {
    column: { id: string; title: string; tasks: Task[] };
    addTask: (columnId: string, title: string) => void;
}

export  function Column({ column, addTask }: ColumnProps) {
    const { setNodeRef } = useDroppable({ id: column.id, data: { columnId: column.id } });
    const [newTask, setNewTask] = useState("");
    const { isOpen, onToggle } = useDisclosure();

    const handleAdd = () => {
        if (!newTask.trim()) return;
        addTask(column.id, newTask);
        setNewTask("");
        onToggle();
    };

    return (
        <Box
            ref={setNodeRef}
            bg="gray.50"
            rounded="lg"
            shadow="md"
            p={3}
            minW="250px"
            flexShrink={0}
        >
            <Heading fontSize="lg" mb={3}>
                {column.title}
            </Heading>

            <VStack align="stretch" spacing={3}>
                {column.tasks.map((task) => (
                    <TaskCard key={task.id} task={task} columnId={column.id} />
                ))}
            </VStack>

            <Collapse in={isOpen} animateOpacity>
                <Input
                    mt={3}
                    size="sm"
                    placeholder="Task title..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                />
                <Button
                    size="sm"
                    mt={2}
                    colorScheme="blue"
                    w="full"
                    onClick={handleAdd}
                >
                    Add Task
                </Button>
            </Collapse>

            {!isOpen && (
                <Button
                    mt={3}
                    size="sm"
                    w="full"
                    colorScheme="teal"
                    variant="outline"
                    onClick={onToggle}
                >
                    + New Task
                </Button>
            )}
        </Box>
    );
}
