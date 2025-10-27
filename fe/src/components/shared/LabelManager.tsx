// src/components/shared/LabelManager.tsx
import {
    Box,
    Button,
    Checkbox,
    Flex,
    FormControl,
    FormLabel,
    HStack,
    Input,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    SimpleGrid,
    Tag,
    Text,
    useDisclosure,
    VStack
} from "@chakra-ui/react";
import { Card, Label } from "../../api/dummy-data";
import { useState } from "react";
import { AddIcon, EditIcon } from "@chakra-ui/icons";

interface LabelManagerProps {
    allLabels: Label[];
    cardLabels: Label[];
    onToggleLabel: (labelId: string) => void;
    onCreateLabel: (name: string, color: string) => void;
    onUpdateLabel: (label: Label) => void;
}

const availableColors = [
    "gray.500", "red.500", "orange.500", "yellow.500", "green.500", "teal.500", "blue.500", "cyan.500", "purple.500", "pink.500",
];

export function LabelManager({ allLabels, cardLabels, onToggleLabel, onCreateLabel, onUpdateLabel }: LabelManagerProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [newLabelName, setNewLabelName] = useState("");
    const [newLabelColor, setNewLabelColor] = useState(availableColors[0]);
    const [editingLabel, setEditingLabel] = useState<Label | null>(null);

    const handleCreate = () => {
        if (newLabelName.trim()) {
            onCreateLabel(newLabelName.trim(), newLabelColor);
            setNewLabelName("");
            setNewLabelColor(availableColors[0]);
            onClose();
        }
    };

    const handleUpdate = () => {
        if (editingLabel && newLabelName.trim()) {
            onUpdateLabel({ ...editingLabel, name: newLabelName.trim(), color: newLabelColor });
            setEditingLabel(null);
            setNewLabelName("");
            setNewLabelColor(availableColors[0]);
            onClose();
        }
    };

    const openEditForm = (label: Label) => {
        setEditingLabel(label);
        setNewLabelName(label.name);
        setNewLabelColor(label.color);
        onOpen();
    };

    const openCreateForm = () => {
        setEditingLabel(null);
        setNewLabelName("");
        setNewLabelColor(availableColors[0]);
        onOpen();
    };

    const isLabelChecked = (labelId: string) => cardLabels.some(l => l.id === labelId);

    return (
        <>
            <Popover placement="bottom-start">
                <PopoverTrigger>
                    <Button size="sm" leftIcon={<AddIcon />}>Labels</Button>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>Labels</PopoverHeader>
                    <PopoverBody>
                        <VStack align="stretch" spacing={2}>
                            {allLabels.map(label => (
                                <Flex key={label.id} align="center">
                                    <Checkbox isChecked={isLabelChecked(label.id)} onChange={() => onToggleLabel(label.id)}>
                                        <Tag colorScheme={label.color.split('.')[0]}>{label.name}</Tag>
                                    </Checkbox>
                                    <Button size="xs" variant="ghost" ml="auto" onClick={() => openEditForm(label)}>
                                        <EditIcon />
                                    </Button>
                                </Flex>
                            ))}
                            <Button size="sm" onClick={openCreateForm}>Create a new label</Button>
                        </VStack>
                    </PopoverBody>
                </PopoverContent>
            </Popover>

            <Popover isOpen={isOpen} onClose={onClose} placement="right-start">
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton onClick={() => { setEditingLabel(null); onClose(); }} />
                    <PopoverHeader>{editingLabel ? "Edit label" : "Create label"}</PopoverHeader>
                    <PopoverBody>
                        <VStack spacing={4}>
                            <FormControl>
                                <FormLabel>Name</FormLabel>
                                <Input value={newLabelName} onChange={(e) => setNewLabelName(e.target.value)} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Color</FormLabel>
                                <SimpleGrid columns={5} spacing={2}>
                                    {availableColors.map(color => (
                                        <Box
                                            key={color}
                                            as="button"
                                            h="25px"
                                            bg={color}
                                            rounded="md"
                                            border={newLabelColor === color ? "2px solid black" : "2px solid transparent"}
                                            onClick={() => setNewLabelColor(color)}
                                        />
                                    ))}
                                </SimpleGrid>
                            </FormControl>
                            <Button colorScheme="blue" w="100%" onClick={editingLabel ? handleUpdate : handleCreate}>
                                {editingLabel ? "Save" : "Create"}
                            </Button>
                        </VStack>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </>
    );
}
