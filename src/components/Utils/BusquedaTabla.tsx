'use client'
import React from 'react'
import { Search, X } from 'lucide-react'

interface BusquedaTablaProps {
    value: string
    onChange: (value: string) => void
    isDarkMode?: boolean
    placeholder?: string
}

export const BusquedaTabla: React.FC<BusquedaTablaProps> = ({
    value,
    onChange,
    isDarkMode = false,
    placeholder = 'Buscar en todas las columnas...'
}) => {
    return (
        <div className="position-relative" style={{ minWidth: '250px', maxWidth: '400px' }}>
            <Search
                className="position-absolute top-50 translate-middle-y "
                size={16}
                style={{
                    left: '12px',
                    color: isDarkMode ? '#6c757d' : '#adb5bd',
                    pointerEvents: 'none'
                }}
            />

            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`form-control ps-5 rounded-3 ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
            />

            {value && (
                <button
                    aria-label="button"
                    type="button"
                    onClick={() => onChange('')}
                    className="btn btn-link position-absolute top-50 translate-middle-y p-0 border-0"
                    style={{
                        right: '12px',
                        color: isDarkMode ? '#adb5bd' : '#6c757d'
                    }}
                >
                    <X size={16} />
                </button>
            )}
        </div>
    )
}
