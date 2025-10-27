// src/components/workspace-components/CardDetailModal.tsx
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    VStack,
    Text,
    Flex,
    Tag,
    AvatarGroup,
    Avatar,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody,
    CheckboxGroup,
    Checkbox,
    Heading,
    Spacer
} from "@chakra-ui/react";
import { Card, Member, dummyMembers, Label } from "../../api/dummy-data";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { DueDateSelector } from "../shared/DueDateSelector";
import { LabelManager } from "../shared/LabelManager";

interface CardDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    card: Card | null;
    onUpdateCard: (updatedCard: Card) => void;
    allLabels: Label[];
    onCreateLabel: (name: string, color: string) => void;
    onUpdateLabel: (label: Label) => void;
}

export function CardDetailModal({ isOpen, onClose, card, onUpdateCard, allLabels, onCreateLabel, onUpdateLabel }: CardDetailModalProps) {
    if (!card) return null;

    const handleMemberToggle = (memberId: string) => {
        const isMemberAssigned = card.members?.some(m => m.id === memberId);
        let updatedMembers: Member[];

        if (isMemberAssigned) {
            updatedMembers = card.members?.filter(m => m.id !== memberId) || [];
        } else {
            const memberToAdd = dummyMembers.find(m => m.id === memberId);
            if (memberToAdd) {
                updatedMembers = [...(card.members || []), memberToAdd];
            } else {
                updatedMembers = card.members || [];
            }
        }
        onUpdateCard({ ...card, members: updatedMembers });
    };

    const handleDueDateChange = (date: Date | null) => {
        onUpdateCard({ ...card, dueDate: date ? date.toISOString() : undefined });
    };

    const handleLabelToggle = (labelId: string) => {
        const isLabelAssigned = card.labels?.some(l => l.id === labelId);
        let updatedLabels: Label[];

        if (isLabelAssigned) {
            updatedLabels = card.labels?.filter(l => l.id !== labelId) || [];
        } else {
            const labelToAdd = allLabels.find(l => l.id === labelId);
            if (labelToAdd) {
                updatedLabels = [...(card.labels || []), labelToAdd];
            } else {
                updatedLabels = card.labels || [];
            }
        }
        onUpdateCard({ ...card, labels: updatedLabels });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{card.title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack align="start" spacing={6}>
                        <Text>{card.description || "No description provided."}</Text>

                        {/* Members Section */}
                        <Flex align="center" w="100%">
                            <Heading size="sm" minW="100px">Members</Heading>
                            <Spacer />
                            <AvatarGroup size="sm" max={4} mr={2}>
                                {card.members?.map(member => (
                                    <Avatar key={member.id} name={member.name} src={member.avatarUrl} />
                                ))}
                            </AvatarGroup>
                            <Popover>
                                <PopoverTrigger>
                                    <Button size="sm" leftIcon={<AddIcon />}>Members</Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                    <PopoverHeader>Assign Members</PopoverHeader>
                                    <PopoverBody>
                                        <CheckboxGroup value={card.members?.map(m => m.id)}>
                                            <VStack align="start">
                                                {dummyMembers.map(member => (
                                                    <Checkbox
                                                        key={member.id}
                                                        value={member.id}
                                                        isChecked={card.members?.some(m => m.id === member.id)}
                                                        onChange={() => handleMemberToggle(member.id)}
                                                    >
                                                        {member.name}
                                                    </Checkbox>
                                                ))}
                                            </VStack>
                                        </CheckboxGroup>
                                    </PopoverBody>
                                </PopoverContent>
                            </Popover>
                        </Flex>

                        {/* Labels Section */}
                        <Flex align="center" w="100%">
                            <Heading size="sm" minW="100px">Labels</Heading>
                            <Spacer />
                            <Flex wrap="wrap" gap={2} justifyContent="flex-end" mr={2}>
                                {card.labels?.map(label => (
                                    <Tag key={label.id} colorScheme={label.color.split('.')[0]}>{label.name}</Tag>
                                ))}
                            </Flex>
                            <LabelManager
                                allLabels={allLabels}
                                cardLabels={card.labels || []}
                                onToggleLabel={handleLabelToggle}
                                onCreateLabel={onCreateLabel}
                                onUpdateLabel={onUpdateLabel}
                            />
                        </Flex>

                        {/* Due Date Section */}
                        <Flex align="center" w="100%">
                            <Heading size="sm" minW="100px">Due Date</Heading>
                            <Spacer />
                            <DueDateSelector
                                selectedDate={card.dueDate ? new Date(card.dueDate) : null}
                                onChange={handleDueDateChange}
                            />
                            {card.dueDate && (
                                <Button size="sm" ml={2} onClick={() => handleDueDateChange(null)}>
                                    <CloseIcon />
                                </Button>
                            )}
                        </Flex>

                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
