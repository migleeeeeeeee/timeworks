import {
  Modal,
  ModalContent,
  ModalBody,
} from "@ds/components/Modal"
import type { Task } from "../types"

type Props = {
  task: Task | null
  onClose: () => void
}

export function TaskDetailModal({ task, onClose }: Props) {
  return (
    <Modal open={task != null} onOpenChange={(v) => !v && onClose()}>
      <ModalContent size="small" title={task?.title ?? ""}>
        {task && (
          <ModalBody>
            <div className="flex flex-col gap-3 text-t2 text-[var(--color-primary-text-color)]">
              <Row label="Status" value={task.status} />
              <Row label="Time allocated" value={task.timeAllocated} />
              <Row label="Time spent" value={task.timeSpent} />
              <Row label="Subtasks" value={`${task.subtasksDone} / ${task.subtasksTotal}`} />
              <Row label="Responsible" value={task.responsible.name} />
              <Row
                label="Members"
                value={
                  task.members.length > 0
                    ? task.members.map((m) => m.name).join(", ")
                    : "—"
                }
              />
              <Row label="Priority" value={task.priority} />
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--color-secondary-text-color)]">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}
