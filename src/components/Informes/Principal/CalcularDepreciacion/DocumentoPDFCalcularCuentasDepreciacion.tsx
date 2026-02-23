import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import ssmso_logo from "../../../../assets/img/SSMSO-LOGO.png"
import { ListaActivosFijos } from './CalcularDepreciacion';

const FONT_SIZES = {
    xs: 5.5,
    sm: 6.5,
    md: 7.5,
    base: 8,
    lg: 9,
    xl: 10,
    xxl: 13,
};
const COLORS = {
    primary: "#004485",
    primaryLight: "#e8f0f8",
    white: "#ffffff",
    black: "#000000",
    grayDark: "#333333",
    grayMedium: "#666666",
    grayLight: "#e0e0e0",
    grayLighter: "#f5f7fa",
    border: "#cccccc",
};

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 12,
    },
    /* ----- Cabecera con logo ----- */
    logoSection: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
        paddingBottom: 10,
        // borderBottomWidth: 2,
        // borderBottomColor: COLORS.primary,
    },
    logo: {
        width: 70,
        marginRight: 12,
    },
    orgInfo: {
        flexDirection: "column",
        gap: 1,
    },
    orgName: {
        fontSize: FONT_SIZES.lg,
        fontWeight: "bold",
        color: COLORS.primary,
        marginBottom: 2,
    },
    orgDetail: {
        fontSize: FONT_SIZES.md,
        color: COLORS.grayMedium,
        marginBottom: 1,
    },

    /* ----- Titulo del documento ----- */
    tituloDocumento: {
        fontSize: FONT_SIZES.xl,
        fontWeight: "bold",
        textAlign: "center",
        // color: COLORS.primary,
        marginBottom: 12,
        paddingBottom: 6,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.grayLight,
    },


    /* ===== GRID INFORMACIÓN ===== */
    headerGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    column: {
        width: "32%",
    },

    label: {
        fontSize: 8,
        fontWeight: "bold",
        color: "#000",
        margin: 1,
    },

    value: {
        fontSize: 8,
        color: "#555",
        marginBottom: 5,
    },
    /* ===== TABLE (NO TOCAR) ===== */
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
        bottom: 3,
        left: 40,
        right: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 6,
        borderTopWidth: 1,
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

const DocumentoCuentasPDF = ({ row, totalRes, totalDep, totalDepAnual, totalMontoInicial }: { row: ListaActivosFijos[]; totalRes: number, totalDep: number, totalDepAnual: number, totalMontoInicial: number }) => {

    return (
        <Document>
            <Page style={styles.page} wrap>
                {/* HEADER */}
                <View style={styles.logoSection}>
                    <Image src={ssmso_logo} style={styles.logo} />
                    <View style={styles.orgInfo}>
                        <Text style={styles.orgName}>
                            Servicio de Salud Metropolitano Sur Oriente
                        </Text>
                        <Text style={styles.orgDetail}>
                            Subdireccion Administrativa
                        </Text>
                        <Text style={styles.orgDetail}>
                            Departamento de Finanzas
                        </Text>
                        <Text style={styles.orgDetail}>Unidad de Inventarios</Text>
                    </View>
                </View>
                <Text style={styles.tituloDocumento}>Informe de Cálculo de Depreciación por Cuentas</Text>

                <View style={styles.headerGrid}>
                    {/* Columna  */}
                    <View style={styles.column}>
                        <Text style={styles.label}>Cantidad: {row.length}</Text>

                    </View>
                </View>

                {/* Tabla */}
                <View style={styles.table}>
                    {/* HEADER TABLA */}
                    <View style={styles.tableHeader} fixed>
                        <Text style={[styles.tableCell, styles.colCuenta]}>Cuenta</Text>
                        <Text style={[styles.tableCell, styles.colDescripcion]}>Descripción</Text>
                        <Text style={[styles.tableCell, styles.colMontoInicial]}>Monto Inicial</Text>
                        <Text style={[styles.tableCell, styles.colDepreciacionAnual]}>Depreciación por Año</Text>
                        <Text style={[styles.tableCell, styles.colDepAcumulada]}>Depreciación Acumulada Actualizada</Text>
                        <Text style={[styles.tableCell, styles.colValorResidual]}>Valor Residual</Text>
                    </View>
                    {/* Fila de datos */}
                    {row.map((lista, idx) => (
                        <View style={styles.tableRow} key={idx} wrap={false}>
                            < Text style={[styles.tableCell, styles.colCuenta]} > {lista.ctA_COD}</Text>
                            < Text style={[styles.tableCell, styles.colDescripcion]} > {lista.ctA_NOMBRE == "0" ? "Sin Descripción" : lista.ctA_NOMBRE}</Text>
                            <Text style={[styles.tableCell, styles.colMontoInicial]}>{(lista.montoInicial === 0 ? "-" : lista.montoInicial?.toLocaleString("es-ES", { minimumFractionDigits: 0 }))}</Text>
                            <Text style={[styles.tableCell, styles.colDepreciacionAnual]}>{(lista.depreciacionPorAno === 0 ? "-" : lista.depreciacionPorAno?.toLocaleString("es-ES", { minimumFractionDigits: 0 }))}</Text>
                            <Text style={[styles.tableCell, styles.colDepAcumulada]}>{(lista.depreciacionAcumuladaActualizada === 0 ? "-" : lista.depreciacionAcumuladaActualizada?.toLocaleString("es-ES", { minimumFractionDigits: 0 }))}</Text>
                            <Text style={[styles.tableCell, styles.colValorResidual]}>{(lista.valorResidual === 0 ? "-" : lista.valorResidual).toLocaleString("es-ES", { minimumFractionDigits: 0 })}</Text>
                        </View>
                    ))}
                    {/* Fila de totales - solo en la última página */}
                    <View style={styles.tableTotalRow} >
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
                </View>

                {/* <Text style={styles.printLabel}>Impreso el {fechaDescarga}</Text> */}

                {/* FOOTER */}
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

        </Document >
    );
};

export default DocumentoCuentasPDF;
