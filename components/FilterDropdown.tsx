import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface FilterDropdownProps {
    items: string[]
    selectedItems: string[]
    onItemSelect: (item: string) => void
    label: string
    width?: string
}

export function FilterDropdown({ items, selectedItems, onItemSelect, label, width = "200px" }: FilterDropdownProps) {
    const singularLabel = label.endsWith('ies') ? label.slice(0, -3) + 'y' : label.slice(0, -1)
    const buttonText = selectedItems.includes('All')
        ? `All ${label}`
        : `${selectedItems.length} ${selectedItems.length === 1 ? singularLabel : label}`

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center justify-between gap-2" style={{ width }}>
                    <span className="truncate">{buttonText}</span>
                    <ChevronsUpDown className="h-4 w-4 flex-shrink-0" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="max-h-[300px] overflow-y-auto"
                style={{ width }}
                align="center"
            >
                {items.map((item) => (
                    <DropdownMenuItem
                        key={item}
                        onSelect={(e) => {
                            e.preventDefault()
                            onItemSelect(item)
                        }}
                    >
                        <div className="flex items-center gap-2 w-full">
                            <Check
                                className={`h-4 w-4 ${selectedItems.includes(item) ? 'opacity-100' : 'opacity-0'}`}
                            />
                            <span className="truncate">{item}</span>
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

