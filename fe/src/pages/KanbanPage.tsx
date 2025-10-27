// src/pages/KanbanPage.tsx
import { Box, Container, Heading } from "@chakra-ui/react";
import { KBBoard } from "../components/kanban-components/KBBoard";
import { useParams } from "react-router-dom";

export default function KanbanPage() {
    const { boardId } = useParams<{ boardId: string }>();

    return (
        <Container maxW="container.xl" py={10}>
            <Heading mb={6} textAlign="center">
                Kanban Board {boardId}
            </Heading>
            <Box>
                <KBBoard />
            </Box>
        </Container>
    );
}
