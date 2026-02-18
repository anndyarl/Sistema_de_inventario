import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import ssmso_logo from "../../../public/logoSSMSO.jpg";
import { ListaBajas } from './ListadoGeneral';

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
    /* ----- Pagina ----- */
    page: {
        padding: 30,
        paddingBottom: 50,
        fontSize: FONT_SIZES.base,
        color: COLORS.grayDark,
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

    /* ----- Seccion de datos del traspaso ----- */
    datosSection: {
        marginBottom: 12,
        // padding: 10,
        // backgroundColor: COLORS.grayLighter,
        // borderRadius: 4,
        // borderWidth: 1,
        // borderColor: COLORS.black,
    },
    datosGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    datosColumnaIzquierda: {
        width: "70%",
    },
    datosColumnaDerecha: {
        width: "30%",
    },
    datosFilaCompleta: {
        width: "100%",
        marginTop: 4,
    },
    datoNumeroTraspaso: {
        fontSize: FONT_SIZES.xl,
        fontWeight: "bold",
        color: COLORS.black,
        marginBottom: 6,
    },
    datoLabel: {
        fontSize: FONT_SIZES.md,
        fontWeight: "bold",
        color: COLORS.grayDark,
        marginBottom: 1,
    },
    datoValor: {
        fontSize: FONT_SIZES.md,
        color: COLORS.grayMedium,
        marginBottom: 4,
    },
    datoInline: {
        flexDirection: "row",
        marginBottom: 3,
    },

    /* ----- Dependencias (Desde / Hasta) ----- */
    dependenciasSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
        gap: 8,
    },
    dependenciaBox: {
        width: "48%",
        padding: 6,
        backgroundColor: COLORS.white,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: COLORS.grayLight,
    },
    dependenciaLabel: {
        fontSize: FONT_SIZES.sm,
        fontWeight: "bold",
        color: COLORS.primary,
        marginBottom: 2,
        textTransform: "uppercase",
    },
    dependenciaValor: {
        fontSize: FONT_SIZES.md,
        color: COLORS.grayDark,
    },

    /* ----- Observacion ----- */
    observacionSection: {
        marginTop: 4,
        marginBottom: 4,
    },
    observacionLabel: {
        fontSize: FONT_SIZES.md,
        fontWeight: "bold",
        color: COLORS.grayDark,
    },
    observacionValor: {
        fontSize: FONT_SIZES.md,
        color: COLORS.grayMedium,
    },
    /* =======================
       TABLE (NO TOCAR)
    ======================= */
    table: {
        flexDirection: "column",
    },

    tableHeader: {
        fontSize: 6,
        flexDirection: "row",
        alignItems: "center",
        fontWeight: "bold",
        backgroundColor: "rgb(0 68 133 / 80%)",
        color: "#fff",
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
        overflow: "hidden",
        flexGrow: 1,
    },

    /* =======================
       COLUMN WIDTHS (NO TOCAR)
    ======================= */
    colCodigo: { width: "10%" },
    colEspecie: { width: "10%", fontSize: 5 },
    colVidaUtil: { width: "5%", fontSize: 5 },
    colMarca: { width: "10%", fontSize: 5 },
    colModelo: { width: "10%", fontSize: 5 },
    colSerie: { width: "15%" },
    colPrecio: { width: "10%" },
    colServicio: { width: "10%" },
    colCuenta: { width: "10%" },

    /* ===== FOOTER ===== */
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
        textAlign: "left",
    },

    footerRight: {
        textAlign: "right",
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

const formatearFecha = (fecha: string) => {
    if (!fecha) return "";
    const [anio, mes, dia] = fecha.split("T")[0].split("-");
    return `${dia}/${mes}/${anio}`;
};

const DocumentoPDFResumenBajas = ({ listaSalidaBajas }: { listaSalidaBajas: ListaBajas[] }) => {
    return (
        <Document>
            <Page style={styles.page} wrap>
                {/* ===== CABECERA CON LOGO ===== */}
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
                <Text style={styles.tituloDocumento}>Registro de Bajas de Activos Fijos</Text>
                {/* ===== DATOS DEL TRASPASO ===== */}
                <View style={styles.datosSection}>
                    {/* Fila superior: numero de traspaso + fechas/memo */}
                    <View style={styles.datosGrid}>
                        <View style={styles.datosColumnaIzquierda}>
                            <Text style={styles.datoNumeroTraspaso}>
                                Certificado Nº {listaSalidaBajas[0].nresolucion}
                            </Text>
                        </View>
                        <View style={styles.datosColumnaDerecha}>
                            <View style={styles.datoInline}>
                                <Text style={styles.datoLabel}>Fecha de Baja: </Text>
                                <Text style={styles.datoValor}>
                                    {formatearFecha(listaSalidaBajas[0].fechA_BAJA)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Dependencias: Desde / Hasta */}
                <View style={styles.dependenciasSection}>
                    <View style={styles.dependenciaBox}>
                        <Text style={styles.dependenciaLabel}>Origen</Text>
                        <Text style={styles.dependenciaValor}>
                            {listaSalidaBajas[0].serv + ' ' + listaSalidaBajas[0].dep}
                        </Text>
                    </View>
                    <View style={styles.dependenciaBox}>
                        <Text style={styles.dependenciaLabel}>Destino</Text>
                        <Text style={styles.dependenciaValor}>
                            Bodega de excluidos
                        </Text>
                    </View>
                </View>

                {/* Observacion */}
                <View style={styles.observacionSection}>
                    <Text style={styles.observacionLabel}>
                        Observacion:{" "}
                        <Text style={styles.observacionValor}>
                            {listaSalidaBajas[0].observaciones}
                        </Text>
                    </Text>
                </View>

                {/* Tabla */}
                <View style={styles.table}>
                    {/* Cabecera de la tabla */}
                    <View style={styles.tableHeader} fixed>
                        {/* <Text style={styles.tableCellHeader}>Código</Text> */}
                        <Text style={[styles.tableCell, styles.colCodigo]}>Nº Inventario</Text>
                        <Text style={[styles.tableCell, styles.colEspecie]}>Especie</Text>
                        <Text style={[styles.tableCell, styles.colMarca]}>Marca</Text>
                        <Text style={[styles.tableCell, styles.colModelo]}>Modelo</Text>
                        <Text style={[styles.tableCell, styles.colSerie]}>Serie</Text>
                        {/* <Text style={[styles.tableCell, styles.colSerie]}>Obs</Text> */}
                        {/* <Text style={[styles.tableCell, styles.colSerie]}>Estado</Text> */}
                    </View>
                    {/* Fila de datos */}
                    {listaSalidaBajas.map((lista, idx) => (
                        <View style={styles.tableRow} key={idx}>
                            <Text style={[styles.tableCell, styles.colCodigo]}>{lista.aF_CLAVE}</Text>
                            <Text style={[styles.tableCell, styles.colEspecie]}>{lista.esP_NOMBRE}</Text>
                            <Text style={[styles.tableCell, styles.colMarca]}>{lista.deT_MARCA}</Text>
                            <Text style={[styles.tableCell, styles.colModelo]}>{lista.deT_MODELO}</Text>
                            <Text style={[styles.tableCell, styles.colSerie]}>{insertNewLinesDigits(lista.deT_SERIE, 10)}</Text>
                            {/* <Text style={[styles.tableCell, styles.colSerie]}>{lista.deT_OBS}</Text> */}
                            {/* <Text style={[styles.tableCell, styles.colSerie]}>{lista.traS_ESTADO}</Text> */}
                        </View>
                    ))}
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

        </Document >
    );
};

export default DocumentoPDFResumenBajas;
