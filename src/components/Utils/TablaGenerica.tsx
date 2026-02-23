'use client'
import React, { useState, useMemo } from 'react'
import { Pencil } from 'lucide-react'
import { Button } from 'react-bootstrap'

interface Column<T> {
    key: keyof T
    header: string
    render?: (value: any, item: T) => React.ReactNode
}

interface TablaGenericaProps<T> {
    data: T[]
    columns?: Column<T>[]
    isDarkMode?: boolean
    onEdit?: (item: T) => void
    onSortChange?: (column: keyof T, direction: 'asc' | 'desc') => void
    sortColumn?: keyof T | null
    sortDirection?: 'asc' | 'desc'
}

export function TablaGenerica<T extends Record<string, any>>({
    data,
    columns = [],
    isDarkMode = false,
    onEdit,
    onSortChange,
    sortColumn: externalSortColumn,
    sortDirection: externalSortDirection

}: TablaGenericaProps<T>) {

    const [internalSortColumn, setInternalSortColumn] = useState<keyof T | null>(null)
    const [internalSortDirection, setInternalSortDirection] = useState<'asc' | 'desc'>('asc')

    // Usar props externas si se proporcionan, si no usar estado interno
    const sortColumn = externalSortColumn !== undefined ? externalSortColumn : internalSortColumn;
    const sortDirection = externalSortDirection !== undefined ? externalSortDirection : internalSortDirection

    const sortedData = useMemo(() => {
        if (!sortColumn) return data

        return [...data].sort((a, b) => {
            const aValue = a[sortColumn]
            const bValue = b[sortColumn]

            if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
                return sortDirection === 'asc'
                    ? Number(aValue) - Number(bValue)
                    : Number(bValue) - Number(aValue)
            }

            return sortDirection === 'asc'
                ? aValue?.toString().localeCompare(bValue?.toString())
                : bValue?.toString().localeCompare(aValue?.toString())
        })
    }, [data, sortColumn, sortDirection])

    const handleSort = (key: keyof T) => {
        let newDirection: 'asc' | 'desc' = 'asc';

        if (sortColumn === key) {
            newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        }

        if (onSortChange) {
            // Modo controlado
            onSortChange(key, newDirection);
        } else {
            // Modo no controlado
            setInternalSortColumn(key);
            setInternalSortDirection(newDirection);
        }
    }

    return (
        <div className="table-responsive">
            <table className={`table ${isDarkMode ? 'table-dark' : 'table-hover table-striped'}`}>
                <thead>
                    <tr>
                        {columns.map((col, i) => (
                            <th
                                key={i}
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleSort(col.key)}
                            >
                                {col.header}
                                <span className="ms-1">
                                    {sortColumn === col.key ? (
                                        // Flecha visible cuando está ordenada
                                        <span className="text-danger">
                                            {sortDirection === 'asc' ? '▲' : '▼'}
                                        </span>
                                    ) : (
                                        // Flecha tenue para indicar que se puede ordenar
                                        <span style={{ opacity: 0.3, fontSize: '0.8em' }}>
                                            ▲▼
                                        </span>
                                    )}
                                </span>
                            </th>
                        ))}
                        {onEdit && <th className="text-center">Acción</th>}
                    </tr>
                </thead>

                <tbody>
                    {sortedData.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + 1} className="text-center text-muted">
                                Sin registros
                            </td>
                        </tr>
                    ) : (
                        sortedData.map((item, index) => (
                            <tr key={index}>
                                {columns.map((col, i) => (
                                    <td key={i}>
                                        {col.render
                                            ? col.render(item[col.key], item)
                                            : item[col.key]}
                                    </td>
                                ))}

                                {onEdit && (
                                    <td className="text-center">
                                        <Button
                                            size="sm"
                                            variant="outline-primary"
                                            onClick={() => onEdit(item)}
                                        >
                                            Editar <Pencil size={14} />
                                        </Button>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}
