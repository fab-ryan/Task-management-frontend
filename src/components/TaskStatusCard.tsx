import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { TaskStatus } from "@/types/task";
import { useState } from "react";

const statusOptions: TaskStatus[] = ["PENDING", "IN_PROGRESS", "COMPLETED"];

export function ChangeStatusModal({
    currentStatus,
    onChangeStatus,
}: {
    currentStatus: TaskStatus;
    onChangeStatus: (newStatus: TaskStatus) => void;
}) {
    const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(currentStatus);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Change Status</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change Task Status</DialogTitle>
                </DialogHeader>
                <Select value={selectedStatus} onValueChange={(value: TaskStatus) => setSelectedStatus(value as TaskStatus)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        {statusOptions.map((status) => (
                            <SelectItem key={status} value={status}>
                                {status.replace("_", " ")}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            onClick={() => onChangeStatus(selectedStatus)}
                            disabled={selectedStatus === currentStatus}
                        >
                            Save
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}