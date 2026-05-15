import { Search } from "@ds/components/Search"
import { Button } from "@ds/components/Button"
import { ButtonGroup, ButtonGroupItem } from "@ds/components/ButtonGroup"

type Props = {
  searchQuery: string
  onSearchChange: (q: string) => void
}

export function PageToolbar({ searchQuery, onSearchChange }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Search
          size="sm"
          value={searchQuery}
          onValueChange={onSearchChange}
          placeholder="Search"
        />
        <Button kind="secondary" size="sm" iconLeft="sliders-simple">
          Filters
        </Button>
      </div>
      <ButtonGroup size="sm" defaultValue="card">
        <ButtonGroupItem value="list">List</ButtonGroupItem>
        <ButtonGroupItem value="card">Card</ButtonGroupItem>
      </ButtonGroup>
    </div>
  )
}
