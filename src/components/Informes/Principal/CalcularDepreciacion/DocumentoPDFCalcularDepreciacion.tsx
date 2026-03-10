import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import ssmso_logo from "../../../../assets/img/SSMSO-LOGO.png";
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
        fontSize: FONT_SIZES.xxl,
        fontWeight: "bold",
        textAlign: "center",
        // color: COLORS.primary,
        marginBottom: 12,
        paddingBottom: 6,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.grayLight,
    },

    /* ----- Totales----- */
    totalSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
        gap: 8,
    },
    totalBox: {
        width: "48%",
        padding: 6,
        backgroundColor: COLORS.white,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: COLORS.grayLight,
    },
    totalLabel: {
        fontSize: FONT_SIZES.sm,
        fontWeight: "bold",
        color: COLORS.primary,
        marginBottom: 2,
        textTransform: "uppercase",
    },
    totalValor: {
        fontSize: FONT_SIZES.md,
        color: COLORS.grayDark,
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
        fontSize: 7,
        // fontWeight: "bold",
        color: "#000",
        margin: 2,
    },

    value: {
        fontSize: 7,
        color: "#555",
        marginBottom: 5,
    },

    table: {
        display: 'flex',
        flexDirection: 'column',
    },

    tableHeader: {
        fontSize: 6,
        flexDirection: "row",
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
        flexGrow: 1,
    },

    colCodigo: { width: "13%", fontSize: 5 },
    colEspecie: { width: "10%", fontSize: 5 },
    colMarca: { width: "10%", fontSize: 5 },
    colModelo: { width: "10%", fontSize: 5 },
    colSerie: { width: "10%", fontSize: 5 },
    colPrecio: { width: "10%", fontSize: 5 },
    colDescripcion: { width: "10%", fontSize: 5 },
    colMesesTranscurridos: { width: "7%" },
    colVidaUtil: { width: "6%", fontSize: 5 },
    colMesVidaUtil: { width: "6%", fontSize: 5 },
    colMesesRestantes: { width: "8%", fontSize: 5 },
    colMontoInicial: { width: "10%", fontSize: 5 },
    colDepreciacionAnual: { width: "10%", fontSize: 5 },
    colDepreciacionMensual: { width: "8%", fontSize: 5 },
    colDepAcumulada: { width: "10%", fontSize: 5 },
    colValorResidual: { width: "10%", fontSize: 5 },

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
    footerLeft: { textAlign: 'left' },
    footerRight: { textAlign: 'right' },
});

/* ======================= SALTOS EN SERIE ======================= */
function insertNewLinesDigits(value: any, every = 10) {
    if (!value) return "";
    const s = String(value);
    return s
        .split("\n")
        .map((line) =>
            line.replace(new RegExp(`(.{${every}})`, "g"), "$1\n")
        )
        .join("\n");
}
const fechaHoy = new Date().toLocaleDateString('es-CL');

const DocumentoPDF = ({ row, totalRes, totalDep, totalDepAnual, }: { row: ListaActivosFijos[]; totalRes: number; totalDep: number; totalDepAnual: number; }) => {

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

                <Text style={styles.tituloDocumento}>Informe de Cálculo de Depreciación por Activos</Text>
                {/* ===== GRID DATOS ===== */}
                <View style={styles.totalSection}>
                    <View style={styles.totalBox}>
                        <Text style={styles.totalLabel}>Total Depreciación Anual</Text>
                        <Text style={styles.totalValor}>
                            $ {(totalDepAnual ?? 0).toLocaleString("es-CL")}
                        </Text>
                    </View>
                    <View style={styles.totalBox}>
                        <Text style={styles.totalLabel}>Total Depreciación Acumulada</Text>
                        <Text style={styles.totalValor}>
                            $ {(totalDep ?? 0).toLocaleString("es-CL")}
                        </Text>
                    </View>
                    <View style={styles.totalBox}>
                        <Text style={styles.totalLabel}>Total Valor Residual</Text>
                        <Text style={styles.totalValor}>
                            $ {(totalRes ?? 0).toLocaleString("es-CL")}
                        </Text>
                    </View>
                </View>

                <View style={styles.headerGrid} fixed>
                    {/* Columna  */}
                    <View style={styles.column}>
                        <Text style={styles.label}>Cantidad: {row.length}</Text>

                    </View>
                </View>

                {/* TABLA */}
                <View style={styles.table}>
                    {/* HEADER TABLA */}
                    <View style={styles.tableHeader} fixed>
                        <Text style={[styles.tableCell, styles.colCodigo]}>Nº Inventario</Text>
                        <Text style={[styles.tableCell, styles.colEspecie]}>Especie</Text>
                        <Text style={[styles.tableCell, styles.colMarca]}>Marca</Text>
                        <Text style={[styles.tableCell, styles.colModelo]}>Modelo</Text>
                        <Text style={[styles.tableCell, styles.colSerie]}>Serie</Text>
                        <Text style={[styles.tableCell, styles.colPrecio]}>Precio</Text>
                        <Text style={[styles.tableCell, styles.colDescripcion]}>Descripción</Text>
                        <Text style={[styles.tableCell, styles.colMesesTranscurridos]}>Meses Transcurridos</Text>
                        <Text style={[styles.tableCell, styles.colVidaUtil]}>Vida Útil</Text>
                        <Text style={[styles.tableCell, styles.colMesVidaUtil]}>Mes Vida Útil</Text>
                        <Text style={[styles.tableCell, styles.colMesesRestantes]}>Meses Restantes</Text>
                        <Text style={[styles.tableCell, styles.colMontoInicial]}>Monto Inicial</Text>
                        <Text style={[styles.tableCell, styles.colDepreciacionMensual]}>Depreciación por Mes</Text>
                        <Text style={[styles.tableCell, styles.colDepreciacionAnual]}>Depreciación por Año</Text>
                        <Text style={[styles.tableCell, styles.colDepAcumulada]}>Depreciación Acumulada</Text>
                        <Text style={[styles.tableCell, styles.colValorResidual]}>Valor Residual</Text>
                    </View>

                    {/* FILAS */}
                    {row.map((lista, idx) => (
                        <View style={styles.tableRow} key={idx} wrap={false}>
                            <Text style={[styles.tableCell, styles.colCodigo]}>
                                {lista.aF_CODIGO_GENERICO}
                            </Text>

                            <Text style={[styles.tableCell, styles.colEspecie]}>
                                {insertNewLinesDigits(lista.especie, 9)}
                            </Text>

                            <Text style={[styles.tableCell, styles.colMarca]}>
                                {insertNewLinesDigits(lista.marca, 9)}
                            </Text>

                            <Text style={[styles.tableCell, styles.colModelo]}>
                                {insertNewLinesDigits(lista.modelo, 9)}
                            </Text>

                            <Text style={[styles.tableCell, styles.colSerie]}>
                                {insertNewLinesDigits(lista.serie, 9)}
                            </Text>

                            <Text style={[styles.tableCell, styles.colPrecio]}>
                                {(lista.precio ?? 0).toLocaleString("es-CL")}
                            </Text>

                            <Text style={[styles.tableCell, styles.colDescripcion]}>
                                {lista.aF_DESCRIPCION === "0"
                                    ? "Sin Descripción"
                                    : lista.aF_DESCRIPCION}
                            </Text>

                            <Text style={[styles.tableCell, styles.colMesesTranscurridos]}>
                                {lista.mesesTranscurridos}
                            </Text>

                            <Text style={[styles.tableCell, styles.colVidaUtil]}>
                                {lista.vidaUtil}
                            </Text>

                            <Text style={[styles.tableCell, styles.colMesVidaUtil]}>
                                {lista.mesVidaUtil}
                            </Text>

                            <Text style={[styles.tableCell, styles.colMesesRestantes]}>
                                {lista.mesesRestantes}
                            </Text>

                            <Text style={[styles.tableCell, styles.colMontoInicial]}>
                                {(lista.montoInicial ?? 0).toLocaleString("es-CL")}
                            </Text>

                            <Text style={[styles.tableCell, styles.colDepreciacionMensual]}>
                                {(lista.depreciacionPorMes ?? 0).toLocaleString("es-CL")}
                            </Text>

                            <Text style={[styles.tableCell, styles.colDepreciacionAnual]}>
                                {(lista.depreciacionPorAno ?? 0).toLocaleString("es-CL")}
                            </Text>

                            <Text style={[styles.tableCell, styles.colDepAcumulada]}>
                                {(lista.depreciacionAcumuladaActualizada ?? 0).toLocaleString("es-CL")}
                            </Text>

                            <Text style={[styles.tableCell, styles.colValorResidual]}>
                                {(lista.valorResidual ?? 0).toLocaleString("es-CL")}
                            </Text>
                        </View>
                    ))}
                </View>

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

            </Page>
        </Document>
    );
};

export default DocumentoPDF;
