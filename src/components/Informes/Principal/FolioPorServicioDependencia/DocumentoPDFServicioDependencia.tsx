import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import ssmso_logo from "../../../../assets/img/SSMSO-LOGO.png"
import { ListaFolioServicioDependencia } from './FolioPorServicioDependencia';

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
        fontSize: 7,
        flexDirection: "row",

    },
    tableRow: {
        flexDirection: "row",
        borderBottom: "1px solid #ccc",
    },
    tableCellHeader: {
        padding: 2,
        fontSize: 7,
        fontWeight: 'bold',
        backgroundColor: 'rgb(0 68 133 / 80%)',
        color: '#fff',
        borderBottom: "1px solid #000"

    },
    tableCell: {
        padding: 2,
        fontSize: 7,
        fontWeight: "bold",
        borderRight: "1px solid #ccc",
        backgroundColor: '#f1f1f1ff',
        overflow: "hidden",
        flexGrow: 1,
    },
    colInventario: { width: "13%", fontSize: 5 },
    colInventarioGris: { width: "13%", backgroundColor: '#c7c7c7ff', fontSize: 5 },
    colEspecie: { width: "13%", fontSize: 5 },
    colMarca: { width: "10%", fontSize: 5 },
    colModelo: { width: "10%", fontSize: 5 },
    colSerie: { width: "12%", fontSize: 5 },
    colObs: { width: "18%", fontSize: 5 },
    colFIngreso: { width: "14%", fontSize: 5 },
    colAlta: { width: "8%", fontSize: 5 },
    colEstado: { width: "7%", fontSize: 5 },
    colTraslado: { width: "8%", fontSize: 5 },
    colPrecio: { width: "12%", fontSize: 5 },
    colCuenta: { width: "9%", fontSize: 5 },

    firmaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 100,
        paddingHorizontal: 20,
    },
    firmaBox: {
        flex: 1,
        alignItems: 'center',
    },
    firmaLabel: {
        marginTop: 5,
        fontSize: 10,
        textAlign: 'center',
    },
    firmaImagen: {
        bottom: 40,
        width: "30%",
        position: 'absolute'
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



// Inserta saltos de línea 
function insertNewLinesDigits(value: any, every = 10) {
    if (value === null || value === undefined) return "";
    const s = String(value);
    // Si ya tiene saltos, procesamos cada línea por separado para no romperlos
    return s
        .split('\n')
        .map(line => line.replace(new RegExp(`(.{${every}})`, 'g'), '$1\n'))
        .join('\n');
}



const DocumentoPDFServicioDependencia = ({ row, Firma }: { row: ListaFolioServicioDependencia[]; Firma: any }) => {

    return (
        <Document>
            <Page size="LETTER" style={styles.page} wrap>
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
                <Text style={styles.tituloDocumento}>INVENTARIO</Text>
                {/* ===== GRID DATOS ===== */}
                <View style={styles.headerGrid}>
                    {/* Columna izquierda */}
                    <View style={styles.column}>
                        <Text style={styles.label}>Servicio:</Text>
                        <Text style={styles.value}>{row[0]?.servicio}</Text>

                        <Text style={styles.label}>Folio:</Text>
                        <Text style={styles.value}>{row[0]?.aF_FOLIO}</Text>

                    </View>

                    {/* Columna derecha */}
                    <View style={styles.column}>
                        <Text style={styles.label}>Dependencia:</Text>
                        <Text style={styles.value}>{row[0]?.dependencia}</Text>

                        <Text style={styles.label}>Fecha:</Text>
                        <Text style={styles.value}>{row[0]?.aF_FINGRESO}</Text>
                    </View>
                </View>

                <View style={styles.headerGrid} fixed>
                    {/* Columna  */}
                    <View style={styles.column}>
                        <Text style={styles.label}>Cantidad: {row.length}</Text>

                    </View>
                </View>
                {/* Tabla */}
                <View style={styles.table}>
                    {/* HEADER TABLA */}
                    <View style={styles.tableHeader} fixed>
                        <Text style={[styles.tableCellHeader, styles.colInventario]}>N° Inventario</Text>
                        <Text style={[styles.tableCellHeader, styles.colEspecie]}>Especie</Text>
                        <Text style={[styles.tableCellHeader, styles.colMarca]}>Marca</Text>
                        <Text style={[styles.tableCellHeader, styles.colModelo]}>Modelo</Text>
                        <Text style={[styles.tableCellHeader, styles.colSerie]}>Serie</Text>
                        <Text style={[styles.tableCellHeader, styles.colObs]}>Observación</Text>
                        <Text style={[styles.tableCellHeader, styles.colFIngreso]}>Fecha Ingreso</Text>
                        <Text style={[styles.tableCellHeader, styles.colAlta]}>N° Alta</Text>
                        <Text style={[styles.tableCellHeader, styles.colEstado]}>Estado</Text>
                        <Text style={[styles.tableCellHeader, styles.colTraslado]}>N° Traslado</Text>
                        <Text style={[styles.tableCellHeader, styles.colPrecio]}>Valor Inicial</Text>
                        <Text style={[styles.tableCellHeader, styles.colCuenta]}>Cuenta Contable</Text>
                    </View>

                    {row.map((lista, idx) => (
                        <View style={styles.tableRow} key={idx}>
                            <Text style={[styles.tableCell, styles.colInventarioGris]}>{lista.aF_CODIGO_GENERICO}</Text>
                            <Text style={[styles.tableCell, styles.colEspecie]}>{lista.aF_ESPECIE}</Text>
                            <Text style={[styles.tableCell, styles.colMarca]}>{lista.aF_MARCA}</Text>
                            <Text style={[styles.tableCell, styles.colModelo]}>{lista.aF_MODELO}</Text>
                            <Text style={[styles.tableCell, styles.colSerie]}>{insertNewLinesDigits(lista.aF_SERIE, 10)}</Text>
                            <Text style={[styles.tableCell, styles.colObs]}>{lista.aF_OBS}</Text>
                            <Text style={[styles.tableCell, styles.colFIngreso]}>{lista.aF_FINGRESO}</Text>
                            <Text style={[styles.tableCell, styles.colAlta]}>{lista.altaS_CORR}</Text>
                            <Text style={[styles.tableCell, styles.colEstado]}>{lista.traS_ESTADO_AF}</Text>
                            <Text style={[styles.tableCell, styles.colTraslado]}>{lista.ntraslado === 0 ? "" : lista.ntraslado}</Text>
                            <Text style={[styles.tableCell, styles.colPrecio]}>$ {(lista.aF_PRECIO ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 0 })}</Text>
                            <Text style={[styles.tableCell, styles.colCuenta]}>{lista.ctA_COD}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.firmaContainer} wrap={false}>
                    <View style={styles.firmaBox}>
                        <Text style={styles.firmaBox}>{Firma.encargadoInventario}</Text>
                        <Text>_______________________</Text>
                        <Text style={styles.firmaLabel}>Encargado</Text>
                    </View>
                    <View style={styles.firmaBox}>
                        <Text style={styles.firmaBox}>{Firma.jefe}</Text>
                        <Text>_______________________</Text>
                        <Text style={styles.firmaLabel}>Jefe</Text>
                    </View>
                    <View style={styles.firmaBox}>
                        <Text style={styles.firmaBox}>{Firma.jefeInventario}</Text>
                        <Text>_______________________</Text>
                        <Text style={styles.firmaLabel}>Jefe de Inventario</Text>
                    </View>
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


export default DocumentoPDFServicioDependencia;
