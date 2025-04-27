import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import { useCallback } from 'react'

interface Props {
  searchQuery: string
  onSearchChange: (value: string) => void
  onCreateClick: () => void
}

const DashboardTableHeader: React.FC<Props> = ({ onCreateClick, onSearchChange, searchQuery }) => {
  const handleSearchInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value)
  }, [onSearchChange])
  
  return (
    <div className="mb-4 flex items-center justify-between">
      <div  className="bg-white relative max-w-md flex-1 pe-3">
        <Search className=" text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        <Input placeholder="Search books..." className="pl-9" value={searchQuery} onChange={handleSearchInput} />
      </div>

      <Button onClick={onCreateClick}>
        <Plus className="mr-2 h-4 w-4" />
        Add New
      </Button>
    </div>
  )
}

export default DashboardTableHeader
