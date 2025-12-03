'use client'

import React, { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from 'react-bootstrap'

interface DataTableProps<T> {
    data: T[]
    columns: {
        key: keyof T
        header: string
        render?: (value: any, item: T) => React.ReactNode
    }[]
    isDarkMode?: boolean
    enableSearch?: boolean
    enablePagination?: boolean
    pageSize?: number
    language?: {
        search: string
        emptyTable: string
        info: string
        infoEmpty: string
        infoFiltered: string
        lengthMenu: string
        paginate: {
            first: string
            last: string
            next: string
            previous: string
        }
        zeroRecords: string
    }
}

export function DataTable<T extends Record<string, any>>({
    data,
    columns,
    isDarkMode = false,
    enableSearch = true,
    enablePagination = true,
    pageSize = 10,
    language = {
        search: 'Buscar:',
        emptyTable: 'No hay información',
        info: 'Mostrando _START_ de _END_ de _TOTAL_ Entradas',
        infoEmpty: 'Mostrando 0 de 0 de 0 Entradas',
        infoFiltered: '(Filtrado de _MAX_ total entradas)',
        lengthMenu: 'Mostrar _MENU_ Entradas',
        paginate: {
            first: 'Primero',
            last: 'Ultimo',
            next: 'Siguiente',
            previous: 'Anterior'
        },
        zeroRecords: 'Sin resultados encontrados'
    }
}: DataTableProps<T>) {
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(pageSize)

    // Filter data based on search term
    const filteredData = useMemo(() => {
        if (!enableSearch || !searchTerm) return data

        return data.filter((item) =>
            columns.some((column) => {
                const value = item[column.key]
                return value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            })
        )
    }, [data, searchTerm, columns, enableSearch])

    // Calculate pagination
    const totalItems = filteredData.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
    const currentData = enablePagination
        ? filteredData.slice(startIndex, endIndex)
        : filteredData

    // Reset to first page when search changes
    React.useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm])

    // Format info text
    const formatInfoText = (text: string) => {
        return text
            .replace('_START_', (startIndex + 1).toString())
            .replace('_END_', endIndex.toString())
            .replace('_TOTAL_', totalItems.toString())
            .replace('_MAX_', data.length.toString())
    }

    return (
        <div className="space-y-4">
            {/* Search and Length Menu */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                {enablePagination && (
                    <div className="flex items-center gap-2">
                        <label className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                            {language.lengthMenu.replace('_MENU_', '')}
                        </label>
                        <select
                            aria-label='paginación'
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value))
                                setCurrentPage(1)
                            }}
                            className={`px-3 py-2 rounded-md border text-sm ${isDarkMode
                                ? 'bg-gray-800 text-white border-gray-600'
                                : 'bg-white text-gray-900 border-gray-300'
                                }`}
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                )}

                {enableSearch && (
                    <div className="flex items-center gap-2">
                        <label className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                            {language.search}
                        </label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="..."
                            className={`w-full sm:w-64 ${isDarkMode ? 'bg-gray-800 text-white border-gray-600' : ''
                                }`}
                        />
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="table-responsive overflow-x-auto">
                <table
                    className={`table w-full ${isDarkMode ? 'table-dark' : 'table-hover table-striped'
                        }`}
                >
                    <thead
                        className={`sticky-top z-0 ${isDarkMode ? 'table-dark' : 'text-dark table-light'
                            }`}
                    >
                        <tr>
                            {columns.map((column, index) => (
                                <th key={index} scope="col" className="text-nowrap">
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className={`text-center py-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                        }`}
                                >
                                    {searchTerm ? language.zeroRecords : language.emptyTable}
                                </td>
                            </tr>
                        ) : (
                            currentData.map((item, rowIndex) => (
                                <tr key={startIndex + rowIndex}>
                                    {columns.map((column, colIndex) => (
                                        <td key={colIndex} className="text-nowrap">
                                            {column.render
                                                ? column.render(item[column.key], item)
                                                : item[column.key]?.toString() || ''}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Info and Pagination */}
            {enablePagination && totalItems > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {formatInfoText(language.info)}
                        {searchTerm && ` ${language.infoFiltered}`}
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className={isDarkMode ? 'bg-gray-800 text-white border-gray-600' : ''}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                            <span className="sr-only">{language.paginate.first}</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className={isDarkMode ? 'bg-gray-800 text-white border-gray-600' : ''}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">{language.paginate.previous}</span>
                        </Button>
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Página {currentPage} de {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className={isDarkMode ? 'bg-gray-800 text-white border-gray-600' : ''}
                        >
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">{language.paginate.next}</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className={isDarkMode ? 'bg-gray-800 text-white border-gray-600' : ''}
                        >
                            <ChevronsRight className="h-4 w-4" />
                            <span className="sr-only">{language.paginate.last}</span>
                        </Button>
                    </div>
                </div>
            )}

            {enablePagination && totalItems === 0 && (
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {language.infoEmpty}
                </div>
            )}
        </div>
    )
}
