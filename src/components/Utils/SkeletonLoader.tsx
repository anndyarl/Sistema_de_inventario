import React from 'react';
import { Table } from 'react-bootstrap';
import SkeletonRow from './SkeletonRow'; // Importa el componente de fila
import '../../styles/skeleton-loader.css'; // Importa los estilos
import { RootState } from '../../store';
import { connect } from 'react-redux';

interface SkeletonLoaderProps {
    rowCount?: number; // Número de filas, por defecto será 10
    columnCount?: number; // Número de columnas, por defecto será 10
    isDarkMode?: boolean; // Indica si el modo oscuro está activado
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    rowCount = 10,
    columnCount = 10,
    isDarkMode = false,
}) => {
    return (
        <div className={`skeleton-table ${isDarkMode ? 'dark-mode' : ''}`}>
            <table className={`table  ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
                <tbody>
                    {[...Array(rowCount)].map((_, index) => (
                        <SkeletonRow key={index} columnCount={columnCount} isDarkMode={isDarkMode}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const mapStateToProps = (state: RootState) => ({
    isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {

})(SkeletonLoader);
