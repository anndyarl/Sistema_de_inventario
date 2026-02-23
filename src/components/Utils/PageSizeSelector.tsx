'use client'
import React from 'react'

interface PageSizeSelectorProps {
    pageSize: number
    total: number
    totalFiltrados: number
    onChange: (size: number) => void
    isDarkMode?: boolean
}

export const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({
    pageSize,
    total,
    totalFiltrados,
    onChange,
    isDarkMode = false
}) => {


    return (
        <>
            {/* Selector de tamaño */}
            < div className="d-flex align-items-center gap-2" >
                <label
                    className={`form-label fw-semibold mb-0 ${isDarkMode ? 'text-light' : ''}`}
                    style={{ fontSize: '0.85rem' }}
                >
                    Tamaño de página:
                </label>

                <select
                    aria-label='paginador'
                    value={pageSize}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className={`form-select form-select-sm w-auto ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
                >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div >

            {/* Info de registros */}
            < span
                className={`small ${isDarkMode ? 'text-light' : 'text-muted'}`}
                style={{ fontSize: '0.8rem' }}
            >
                Mostrando {totalFiltrados} de {total} registros
            </span >
        </>
    )
}
