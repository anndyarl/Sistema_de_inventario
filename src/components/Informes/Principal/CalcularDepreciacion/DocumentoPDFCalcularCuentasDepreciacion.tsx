import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

import ssmso_logo from "../../../../assets/img/SSMSO-LOGO.png"
import { Container } from 'react-bootstrap';
import { ListaActivosFijos } from './CalcularDepreciacion';


// Formatear la fecha actual en español (Chile)
// const fechaHoy = new Date().toLocaleDateString('es-CL', {
//     day: '2-digit',
//     month: 'long',
//     year: 'numeric',
// });

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 12,
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    logo: {
        width: 100, // Ajusta el tamaño del logo
        height: 'auto',
    },
    containerHeader: {
        marginTop: 15,
        marginBottom: 5,
    },
    textContainer: {
        marginLeft: 5
    },
    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    headerContent: {
        display: 'flex',
        flexDirection: 'row',
        // justifyContent: 'space-between'
    },
    header: {
        flex: 1,
        fontSize: 6,
        marginBottom: 5,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    center: {
        textAlign: 'center',
        marginBottom: 20
    },
    p: {
        fontSize: 8,
        marginBottom: 2,
        fontWeight: 'semibold',
        textAlign: 'center',
    },
    table: {
        display: 'flex',
        flexDirection: 'column',
    },
    tableHeader: {
        fontSize: 6,
        flexDirection: "row",
        alignContent: "center",
        fontWeight: 'bold',
        backgroundColor: 'rgb(0 68 133 / 80%)',
        color: '#fff',
        borderBottom: "1px solid #000",
    },
    tableRow: {
        flexDirection: "row",
        borderBottom: "1px solid #ccc",
        alignItems: "center",
    },
    tableCell: {
        padding: 3,
        fontSize: 6,
        borderRight: "1px solid #ccc",
        // textAlign: "center",
        overflow: "hidden",
        flexGrow: 1,
    },

    colCuenta: { width: "10%" },
    colDescripcion: { width: "10%", fontSize: 5 },
    colDepAcumulada: { width: "10%" },
    colValorResidual: { width: "10%" },
    colDepreciacionAnual: { width: "10%" },
    colMontoInicial: { width: "10%" },
    tableTotalRow: {
        flexDirection: "row",
        borderBottom: "1px solid #000",
        borderTop: "1px solid #000",
        alignItems: "center",
        backgroundColor: '#f0f0f0',
    },
    totalLabel: {
        padding: 3,
        fontSize: 6,
        fontWeight: 'bold',
        borderRight: "1px solid #ccc",
        width: "27%",
    },
    fechaHoy: {
        padding: 2,
    },

    footer: {
        position: 'absolute',
        bottom: 20,          // distancia del borde inferior
        left: 40,
        right: 40,
        height: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',  // separa fecha y numeración
        alignItems: 'center',
        fontSize: 9,
        color: '#000',
        borderTopWidth: 1,                // línea separadora superior
        borderTopColor: '#ccc',
        paddingTop: 4,
    },
    footerLeft: {
        textAlign: 'left',
    },
    footerRight: {
        textAlign: 'right',
    },
});


// Formatear la fecha actual en español (Chile)
const fechaHoy = new Date()
    .toLocaleDateString('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
    .replace(/-/g, '/');


const arreglo = (array: any[], size: number) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
};

const DocumentoCuentasPDF = ({ row, totalRes, totalDep, totalDepAnual, totalMontoInicial }: { row: ListaActivosFijos[]; totalRes: number, totalDep: number, totalDepAnual: number, totalMontoInicial: number }) => {

    const filasPorPagina = 12;
    const paginas = arreglo(row, filasPorPagina);
    return (
        <Document>
            {paginas.map((rows, indicePagina) => (
                <Page key={indicePagina} style={styles.page}>
                    {/* Logo */}
                    <Container style={styles.containerHeader}>
                        <View style={styles.headerContainer}>
                            {/* Logo a la izquierda */}
                            <Image src={ssmso_logo || "/placeholder.svg"} style={styles.logo} />
                            {/* Textos a la derecha */}
                            <View style={styles.textContainer}>
                                <Text style={styles.p}>Servicio de Salud Metropolitano Sur Oriente</Text>
                                <Text style={styles.p}>Subdirección Administrativa</Text>
                                <Text style={styles.p}>Departamento de Finanzas</Text>
                                {/* <Text style={styles.p}>Unidad de Inventarios</Text> */}
                            </View>
                        </View>
                    </Container>
                    {/* Encabezado */}
                    <Container style={styles.containerHeader}>
                        <Text style={styles.center}>Informe de Cálculo de Depreciación por Cuenta</Text>

                        <View style={styles.headerContent}>
                            <Text style={[styles.p, { textAlign: 'right' }]}>Cantidad: {row.length}</Text>
                        </View>
                    </Container>
                    {/* Tabla */}
                    <View style={styles.table}>
                        {/* Cabecera de la tabla */}
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableCell, styles.colCuenta]}>Cuenta</Text>
                            <Text style={[styles.tableCell, styles.colDescripcion]}>Descripción</Text>
                            <Text style={[styles.tableCell, styles.colMontoInicial]}>Monto Inicial</Text>
                            <Text style={[styles.tableCell, styles.colDepreciacionAnual]}>Depreciación por Año</Text>
                            <Text style={[styles.tableCell, styles.colDepAcumulada]}>Depreciación Acumulada Actualizada</Text>
                            <Text style={[styles.tableCell, styles.colValorResidual]}>Valor Residual</Text>
                        </View>
                        {/* Fila de datos */}
                        {rows.map((lista, idx) => (
                            <View style={styles.tableRow} key={idx}>
                                < Text style={[styles.tableCell, styles.colCuenta]} > {lista.ctA_COD}</Text>
                                < Text style={[styles.tableCell, styles.colDescripcion]} > {lista.ctA_NOMBRE == "0" ? "Sin Descripción" : lista.ctA_NOMBRE}</Text>
                                <Text style={[styles.tableCell, styles.colMontoInicial]}>{(lista.montoInicial === 0 ? "-" : lista.montoInicial?.toLocaleString("es-ES", { minimumFractionDigits: 0 }))}</Text>
                                <Text style={[styles.tableCell, styles.colDepreciacionAnual]}>{(lista.depreciacionPorAno === 0 ? "-" : lista.depreciacionPorAno?.toLocaleString("es-ES", { minimumFractionDigits: 0 }))}</Text>
                                <Text style={[styles.tableCell, styles.colDepAcumulada]}>{(lista.depreciacionAcumuladaActualizada === 0 ? "-" : lista.depreciacionAcumuladaActualizada?.toLocaleString("es-ES", { minimumFractionDigits: 0 }))}</Text>
                                <Text style={[styles.tableCell, styles.colValorResidual]}>{(lista.valorResidual === 0 ? "-" : lista.valorResidual).toLocaleString("es-ES", { minimumFractionDigits: 0 })}</Text>
                            </View>
                        ))}
                        {/* Fila de totales - solo en la última página */}
                        {indicePagina === paginas.length - 1 && (
                            <View style={styles.tableTotalRow}>
                                <Text style={[styles.tableCell, styles.totalLabel]}>TOTALES</Text>
                                <Text style={[styles.tableCell, styles.colDepAcumulada]}>
                                    $ {(totalMontoInicial ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                </Text>
                                <Text style={[styles.tableCell, styles.colDepreciacionAnual]}>
                                    $ {(totalDepAnual ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                </Text>
                                <Text style={[styles.tableCell, styles.colDepAcumulada]}>
                                    $ {(totalDep ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                </Text>
                                <Text style={[styles.tableCell, styles.colValorResidual]}>
                                    $ {(totalRes ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* <Text style={styles.printLabel}>Impreso el {fechaDescarga}</Text> */}

                    <View style={styles.footer} fixed>
                        <Text style={styles.footerLeft}>{fechaHoy}</Text>

                        <Text
                            style={styles.footerRight}
                            render={({ pageNumber, totalPages }) =>
                                `Página ${pageNumber} de ${totalPages}`
                            }
                        />
                    </View>

                </Page >
            ))}
        </Document >
    );
};

export default DocumentoCuentasPDF;
