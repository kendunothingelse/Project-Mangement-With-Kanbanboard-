// src/pages/WorkspacePage.tsx
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    SimpleGrid,
    useDisclosure
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {Board, dummyBoards} from "../api/dummy-data";
import {BoardCard} from "../components/workspace-components/BoardCard";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";

export default function WorkspacePage() {
    const [boards, setBoards] = useState<Board[]>([]);
    const [newBoardName, setNewBoardName] = useState("");
    const {isOpen, onOpen, onClose} = {
        isOpen: false,
        onOpen: () => (document.getElementById("create-board-modal-open") as HTMLButtonElement)?.click(),
        onClose: () => {
        }
    } as any;

    const {logout} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Simulate fetching data
        setBoards(dummyBoards);
    }, []);

    const handleCreateBoard = () => {
        if (newBoardName.trim() === "") return;
        const newBoard: Board = {
            id: `board-${Date.now()}`,
            name: newBoardName,
            workspaceId: "ws-1",
        };
        setBoards(prev => [...prev, newBoard]);
        setNewBoardName("");
        onClose();
    };
    const handleLogout = () => {
        logout();
        navigate("/login", {replace: true});
    };
    return (
        <>
            <Container maxW="6xl" py={10}>
                <Heading mb={6} textAlign="center">
                    My Workspace
                </Heading>
                <Box mb={6} display="flex" gap={3}>
                    <Button onClick={onOpen} mb={6} colorScheme="blue">Create New Board</Button>
                    <Button variant="outline" onClick={handleLogout}>Logout</Button>
                </Box>
                <SimpleGrid columns={{base: 1, sm: 2, md: 3, lg: 4}} spacing={6}>
                    {boards.map(board => (
                        <BoardCard key={board.id} board={board}/>
                    ))}
                </SimpleGrid>
            </Container>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Create a new board</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Board Name</FormLabel>
                            <Input
                                placeholder="e.g., Project Phoenix"
                                value={newBoardName}
                                onChange={(e) => setNewBoardName(e.target.value)}
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="blue" onClick={handleCreateBoard}>
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
