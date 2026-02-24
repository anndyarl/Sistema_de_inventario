'use client'
import React, { useState, useMemo } from 'react'
import { Pencil } from 'lucide-react'
import { Button, Form } from 'react-bootstrap'

interface Column<T> {
    key: keyof T
    header: React.ReactNode
    render?: (value: any, item: T) => React.ReactNode
    disableSort?: boolean // Añadimos esta propiedad opcional
}

interface TablaGenericaProps<T> {
    data: T[]
    columns?: Column<T>[]
    isDarkMode?: boolean
    onEdit?: (item: T) => void
    onSortChange?: (column: keyof T, direction: 'asc' | 'desc') => void
    sortColumn?: keyof T | null
    sortDirection?: 'asc' | 'desc'
    // Props para selección
    seleccionable?: boolean
    filasSeleccionadas?: string[]
    onSeleccionarFila?: (index: number) => void
    onSeleccionarTodos?: (e: React.ChangeEvent<HTMLInputElement>) => void
    indiceInicio?: number
}

export function TablaGenerica<T extends Record<string, any>>({
    data,
    columns = [],
    isDarkMode = false,
    onEdit,
    onSortChange,
    sortColumn: externalSortColumn,
    sortDirection: externalSortDirection,
    // Props para selección
    seleccionable = false,
    filasSeleccionadas = [],
    onSeleccionarFila,
    onSeleccionarTodos,
    indiceInicio = 0
}: TablaGenericaProps<T>) {

    const [internalSortColumn, setInternalSortColumn] = useState<keyof T | null>(null)
    const [internalSortDirection, setInternalSortDirection] = useState<'asc' | 'desc'>('asc')

    const sortColumn = externalSortColumn !== undefined ? externalSortColumn : internalSortColumn;
    const sortDirection = externalSortDirection !== undefined ? externalSortDirection : internalSortDirection;

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
            onSortChange(key, newDirection);
        } else {
            setInternalSortColumn(key);
            setInternalSortDirection(newDirection);
        }
    }

    // Función para obtener el indicador de ordenamiento
    const getSortIndicator = (col: Column<T>) => {
        // Si la columna tiene deshabilitado el ordenamiento, no mostrar nada
        if (col.disableSort) {
            return null;
        }

        if (sortColumn === col.key) {
            return (
                <span className="ms-1 text-danger" style={{ fontSize: '0.9em' }}>
                    {sortDirection === 'asc' ? '▲' : '▼'}
                </span>
            );
        }

        // Para columnas ordenables pero no activas
        return (
            <span
                className="ms-1"
                style={{
                    opacity: 0.3,
                    fontSize: '0.8em',
                    display: 'inline-block'
                }}
            >
                ↕
            </span>
        );
    };

    // Verificar si todas las filas de la página están seleccionadas
    const todasSeleccionadas = seleccionable &&
        data.length > 0 &&
        data.every((_, index) =>
            filasSeleccionadas.includes((indiceInicio + index).toString())
        );

    return (
        <div className="table-responsive">
            <table className={`table ${isDarkMode ? 'table-dark' : 'table-hover table-striped'}`}>
                <thead>
                    <tr>
                        {/* Columna de checkbox para selección múltiple - ESTA NO ESTÁ EN columns */}
                        {seleccionable && (
                            <th style={{ width: '40px' }}>
                                {/* Esta columna NO tiene indicador de ordenamiento */}
                            </th>
                        )}

                        {columns.map((col, i) => (
                            <th
                                key={i}
                                style={{
                                    cursor: col.disableSort ? 'default' : 'pointer',
                                    userSelect: 'none'
                                }}
                                onClick={() => !col.disableSort && handleSort(col.key)}
                                title={col.disableSort ? '' : "Haz clic para ordenar"}
                            >
                                {col.header}
                                {getSortIndicator(col)}  {/* Pasamos toda la columna, no solo el key */}
                            </th>
                        ))}
                        {onEdit && <th className="text-center">Acción</th>}
                    </tr>
                </thead>

                <tbody>
                    {sortedData.length === 0 ? (
                        <tr>
                            <td
                                colSpan={
                                    columns.length +
                                    (onEdit ? 1 : 0) +
                                    (seleccionable ? 1 : 0)
                                }
                                className="text-center text-muted"
                            >
                                Sin registros
                            </td>
                        </tr>
                    ) : (
                        sortedData.map((item, index) => {
                            const indexReal = indiceInicio + index;

                            return (
                                <tr key={index}>
                                    {/* Checkbox individual */}
                                    {seleccionable && (
                                        <td>
                                            <Form.Check
                                                type="checkbox"
                                                onChange={() => onSeleccionarFila?.(indexReal)}
                                                checked={filasSeleccionadas.includes(indexReal.toString())}
                                            />
                                        </td>
                                    )}

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
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    )
}