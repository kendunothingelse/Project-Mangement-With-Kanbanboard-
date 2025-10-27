import {Box, Container, Heading} from "@chakra-ui/react";
import {Board} from "../components/KBBoard";

export default function KanbanPage() {
    return (
        <>
            <Container maxW="6xl" py={10}>
                <Heading mb={6} textAlign="center">
                    Simple Kanban Board
                </Heading>
                <Box>
                    <Board/>
                </Box>
            </Container>
        </>
    );
}
