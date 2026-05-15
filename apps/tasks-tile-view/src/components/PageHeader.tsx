import { Button } from "@ds/components/Button"

export function PageHeader() {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-h2 font-bold text-[var(--color-primary-text-color)]">
        Tasks
      </h1>
      <div className="flex items-center gap-3">
        <Button kind="secondary" size="sm" iconLeft="arrow-up-right-from-square">
          Portal View
        </Button>
        <Button kind="primary" size="sm" iconLeft="plus-small">
          Create new Task
        </Button>
      </div>
    </div>
  )
}
