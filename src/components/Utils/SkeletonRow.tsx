import React from 'react';

interface SkeletonRowProps {
    columnCount: number; // Número de columnas
    isDarkMode: boolean; // Indica si el modo oscuro está activado
}

const SkeletonRow: React.FC<SkeletonRowProps> = ({ columnCount, isDarkMode }) => (
    <tr>
        {[...Array(columnCount)].map((_, index) => (
            <td key={index}>
                <div
                    className={`skeleton-loader ${isDarkMode ? 'dark-mode' : ''}`}
                ></div>
            </td>
        ))}
    </tr>
);

export default SkeletonRow;
