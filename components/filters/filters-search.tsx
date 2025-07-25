import React from 'react'
import { Button } from '../ui/button'
import { Filter, Search } from 'lucide-react'
import { FiltersType } from '@/types';

interface Props {
    search: string;
    onSearch: (value: string) => void;
    filter: string;
    onFilter: (value: string) => void;
    placeholder: string;
    filters: FiltersType[]
}

const FiltersSearch = ({ search, onSearch, filter, onFilter, placeholder, filters }: Props) => {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                    value={search}
                    onChange={e => onSearch(e.target.value)}
                    type="search"
                    placeholder={placeholder}
                    className="w-full rounded-md border border-input bg-background pl-10 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
            </div>
            <div className="flex gap-2">
                <select
                    className="rounded-md border w-full border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={filter}
                    onChange={e => onFilter(e.target.value)}
                >
                    <option value="">Todos</option>
                    {
                        filters.map((filter, index) => (
                            <option key={index} value={filter.value}>{filter.name}</option>
                        ))
                    }
                </select>
                <Button variant="outline" size="icon">
                    <Filter className="h-5 w-5" />
                    <span className="sr-only">Filtrar</span>
                </Button>
            </div>
        </div>
    )
}

export default FiltersSearch