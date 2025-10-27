import {useState} from "react";
import {Flex} from "@chakra-ui/react";
import {DndContext, DragEndEvent} from "@dnd-kit/core";
import {Column} from "./KBColumn";

interface Task {
    id: string;
    title: string;
}

interface ColumnData {
    id: string;
    title: string;
    tasks: Task[];
}

export function Board() {
    const [columns, setColumns] = useState<ColumnData[]>([
        {
            id: "todo",
            title: "To Do",
            tasks: [
                {id: "t1", title: "Setup project"},
                {id: "t2", title: "Design layout"},
            ],
        },
        {id: "in-progress", title: "In Progress", tasks: []},
        {id: "done", title: "Done", tasks: []},
    ]);

    // Xử lý kéo thả giữa các cột
    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;
        if (!over || active.id === over.id) return;

        const sourceColId = active.data.current?.columnId;
        const destColId = over.data.current?.columnId;
        if (!sourceColId || !destColId) return;

        setColumns((prev) => {
            const sourceCol = prev.find((c) => c.id === sourceColId)!;
            const destCol = prev.find((c) => c.id === destColId)!;

            const movingTask = sourceCol.tasks.find((t) => t.id === active.id)!;

            return prev.map((col) => {
                if (col.id === sourceColId)
                    return {...col, tasks: col.tasks.filter((t) => t.id !== active.id)};
                if (col.id === destColId)
                    return {...col, tasks: [...col.tasks, movingTask]};
                return col;
            });
        });
    };

    // Hàm thêm task mới
    const addTask = (columnId: string, title: string) => {
        setColumns((prev) =>
            prev.map((col) =>
                col.id === columnId
                    ? {
                        ...col,
                        tasks: [
                            ...col.tasks,
                            {id: `t${Date.now()}`, title: title || "New Task"},
                        ],
                    }
                    : col
            )
        );
    };

    return (
        <>
            <DndContext onDragEnd={handleDragEnd}>
                <Flex gap={4} align="flex-start" overflowX="auto">
                    {columns.map((col) => (
                        <Column key={col.id} column={col} addTask={addTask}/>
                    ))}
                </Flex>
            </DndContext>
        </>
    );
}
